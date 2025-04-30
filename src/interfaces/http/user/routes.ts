import { Router } from "express";
import { registerUserHandler } from "./factories/registerUser.factory";

const authRoutes = Router();

authRoutes.post("/register", registerUserHandler);

export default authRoutes;
