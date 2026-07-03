import { DocumentStatus } from "../document-status.enum";
import { DocumentEntity } from "../entities/document.entity";

export class DocumentDto {
    id!: string;
    originalName!: string;
    mimeType!: string;
    size!: number;
    storagePath!: string;
    status!: DocumentStatus;
    extractedText?: string;
    aiSummary?: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(entity: DocumentEntity) {
        this.id = entity.id;
        this.originalName = entity.originalName;
        this.mimeType = entity.mimeType;
        this.size = entity.size;
        this.storagePath = entity.storagePath;
        this.status = entity.status;
        this.extractedText = entity.extractedText;
        this.aiSummary = entity.aiSummary;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}
