import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDocumentSize1783074728362 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "documents",
            new TableColumn({
                name: "size",
                type: "integer",
                isNullable: false,
                default: 0,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("documents", "size");
    }
}
