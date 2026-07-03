import { config } from "dotenv";

config({
    path: "./.env.development.local",
});

import { DataSourceOptions } from "typeorm";
import { DocumentEntity, UserEntity } from "@app/shared";

export const ormConfig: DataSourceOptions = {
    type: "postgres",
    url: process.env.DATABASE_URL,

    entities: [DocumentEntity, UserEntity],
    migrations: [__dirname + "/migrations/*.{ts,js}"],

    synchronize: false,
};
