import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { DocumentStatus } from "../document-status.enum";
import { UserEntity } from "./user.entity";

@Entity("documents")
export class DocumentEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    originalName!: string;

    @Column({ type: "varchar" })
    mimeType!: string;

    @Column({ type: "integer" })
    size!: number;

    @Column({ type: "varchar" })
    storagePath!: string;

    @ManyToOne(() => UserEntity)
    user!: UserEntity;

    @Column({
        type: "enum",
        enum: DocumentStatus,
        default: DocumentStatus.UPLOADED,
    })
    status!: DocumentStatus;

    @Column({
        type: "text",
        nullable: true,
    })
    extractedText?: string;

    @Column({
        type: "text",
        nullable: true,
    })
    aiSummary?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
