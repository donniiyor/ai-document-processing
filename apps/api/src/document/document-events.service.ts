import { Subject } from "rxjs";
import { Injectable, MessageEvent, OnModuleInit } from "@nestjs/common";
import { DocumentStatus } from "@app/shared";

import { RedisService } from "../redis/redis.service";

@Injectable()
export class DocumentEventsService implements OnModuleInit {
    private readonly streams = new Map<string, Subject<MessageEvent>>();

    constructor(private readonly redisService: RedisService) {}

    async onModuleInit() {
        await this.redisService.subscriber.subscribe("document-events");

        this.redisService.subscriber.on("message", (_, message) => {
            const data = JSON.parse(message);

            this.emit(data.id, data.status);
        });
    }

    getStream(documentId: string): Subject<MessageEvent> {
        let stream = this.streams.get(documentId);

        if (!stream) {
            stream = new Subject<MessageEvent>();
            this.streams.set(documentId, stream);
        }

        return stream;
    }

    emit(documentId: string, data: DocumentStatus) {
        this.getStream(documentId).next({
            data,
        });
    }

    close(documentId: string) {
        this.getStream(documentId).complete();
        this.streams.delete(documentId);
    }
}
