import { Router } from "express";
import { registerUserHandler } from "./user.factory";

const authRoutes = Router();

/**
 * POST /register
 * Route handler for registering a new user.
 */
authRoutes.post("/register", registerUserHandler);

export default authRoutes;
