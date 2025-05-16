// src/main/index.ts
import "reflect-metadata";
import "dotenv/config";

import { ExpressHttpServer } from "@/infrastructure/main/express/server";
import { HttpServer } from "@/shared/interfaces/IHttpServer";
import connectToDatabase from "@/shared/config/db";
import { PORT } from "@/shared/constants/env";

async function bootstrap() {
  await connectToDatabase();

  const server: HttpServer = new ExpressHttpServer();
  await server.start(PORT);
}

bootstrap();
