import "./env";

import "reflect-metadata";
import { Worker } from "bullmq";
import IORedis from "ioredis";

import { DocumentEntity, DocumentStatus } from "@app/shared";

import { AppDataSource } from "./data-source";
import { extractTextFromPdf } from "./extract-text";
import { summarizeText } from "./summarize";
import { downloadFile } from "./download-file";

async function bootstrap() {
    await AppDataSource.initialize();

    console.log("Worker database connected");

    const connection = new IORedis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        maxRetriesPerRequest: null,
    });

    const publisher = new IORedis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        maxRetriesPerRequest: null,
    });

    const worker = new Worker(
        "document-processing",

        async (job) => {
            console.log("Processing job:", job.id);

            const repository = AppDataSource.getRepository(DocumentEntity);

            const document = await repository.findOneBy({
                id: job.data.documentId,
            });

            try {
                if (!document) {
                    throw new Error("Document not found");
                }

                document.status = DocumentStatus.PROCESSING;

                await repository.save(document);

                await publisher.publish(
                    "document-events",

                    JSON.stringify({
                        id: document.id,
                        status: document.status,
                    }),
                );

                const fileBuffer = await downloadFile(document.storagePath);

                const extractedText = await extractTextFromPdf(fileBuffer);

                document.extractedText = extractedText;

                const summary = await summarizeText(extractedText);

                if (summary) document.aiSummary = summary;

                document.status = DocumentStatus.COMPLETED;

                await repository.save(document);

                await publisher.publish(
                    "document-events",

                    JSON.stringify({
                        id: document.id,
                        status: document.status,
                    }),
                );

                console.log("Document processed");
            } catch (error) {
                console.error(error);

                if (document) {
                    document.status = DocumentStatus.FAILED;

                    await publisher.publish(
                        "document-events",

                        JSON.stringify({
                            id: document.id,
                            status: document.status,
                        }),
                    );

                    await AppDataSource.getRepository(DocumentEntity).save(
                        document,
                    );
                }

                throw error;
            }
        },

        {
            connection,
        },
    );

    worker.on("completed", (job) => {
        console.log(`Job ${job.id} completed`);
    });

    worker.on("failed", (job, error) => {
        console.error(`Job ${job?.id} failed`);
        console.error(error);
    });

    process.on("SIGTERM", async () => {
        await worker.close();

        await connection.quit();
        await publisher.quit();

        await AppDataSource.destroy();
    });
}

bootstrap();
