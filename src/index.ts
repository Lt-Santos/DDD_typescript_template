import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { NODE_ENV, PORT, APP_ORIGIN } from "@/shared/constants/env";
import connectToDatabase from "@/config/db";
import cookieParser from "cookie-parser";
import errorHandler from "@/interfaces/middlewares/errorHandler";
import { OK } from "@/shared/constants/http";
import authRoutes from "@/interfaces/http/user/routes";

const app = express();

//Middlewares
app.use(helmet());
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.get("/health", (req, res, next) => {
  try {
    res.status(OK).json({
      status: "healthy",
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on PORT ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
