import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Request } from "express";

import { ChatDto, DocumentDto } from "@app/shared";

import { DocumentService } from "./document.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;

@UseGuards(JwtAuthGuard)
@Controller("documents")
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Get()
    async findAll(
        @Req() request: Request & { user: { userId: string } },
    ): Promise<DocumentDto[]> {
        const documents = await this.documentService.findAll(
            request.user.userId,
        );

        return documents.map((document) => new DocumentDto(document));
    }

    @Post("upload")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: memoryStorage(),
            limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
        }),
    )
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Req()
        request: Request & { user: { userId: string } },
    ) {
        return this.documentService.create(file, request.user.userId);
    }

    @Post(":id/chat")
    chat(
        @Param("id")
        documentId: string,

        @Body()
        dto: ChatDto,

        @Req()
        request: Request & { user: { userId: string } },
    ) {
        return this.documentService.chat(
            documentId,
            dto.question,
            request.user.userId,
        );
    }
}
