import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";

import { DocumentEntity, UserEntity } from "@app/shared";

import { DocumentService } from "./document.service";
import { DocumentController } from "./document.controller";
import { DocumentEventsService } from "./document-events.service";
import { AiModule } from "../ai/ai.module";
import { StorageModule } from "../storage/storage.module";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([DocumentEntity, UserEntity]),
        BullModule.registerQueue({ name: "document-processing" }),
        RedisModule,
        AiModule,
        StorageModule,
    ],
    controllers: [DocumentController],
    providers: [DocumentService, DocumentEventsService],
})
export class DocumentModule {}
