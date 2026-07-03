import * as path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";

import { AppController } from "./app.controller";
import { DocumentModule } from "./document/document.module";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./health.controller";
import { ormConfig } from "./database/orm.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: path.resolve(
                process.cwd(),
                process.env.NODE_ENV === "production"
                    ? "apps/api/.env.production.local"
                    : ".env.development.local",
            ),
        }),

        TypeOrmModule.forRoot({ ...ormConfig, autoLoadEntities: true }),

        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: () => ({
                connection: {
                    host: process.env.REDIS_HOST,
                    port: Number(process.env.REDIS_PORT),
                },
            }),
        }),

        AuthModule,

        DocumentModule,
    ],
    controllers: [AppController, HealthController],
})
export class AppModule {}
