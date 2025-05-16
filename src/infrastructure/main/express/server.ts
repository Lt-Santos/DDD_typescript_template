// infrastructure/http/ExpressHttpServer.ts
import express, { Express, Request, Response } from "express";
import { HttpServer } from "@/shared/interfaces/IHttpServer";
import authRoutes from "@/interfaces/http/user/routes";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { APP_ORIGIN } from "@/shared/constants/env";
import { OK } from "@/shared/constants/http";

export class ExpressHttpServer implements HttpServer {
  private app: Express;

  constructor() {
    this.app = express();

    // Global middlewares
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: APP_ORIGIN,
        credentials: true,
      })
    );
    this.app.use(morgan("dev"));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Health check route
    this.app.get("/health", (_req: Request, res: Response) => {
      res.status(OK).json({ status: "healthy" });
    });

    // Application routes
    this.app.use("/auth", authRoutes);
  }

  public async start(port: number | string): Promise<void> {
    this.app.listen(port, () => {
      console.log(`[Express] Server running on port ${port}`);
    });
  }
}
