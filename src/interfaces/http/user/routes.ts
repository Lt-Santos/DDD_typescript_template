import { Router } from "express";
import { makeRegisterUserController } from "./user.factory";
import { adaptExpressRoute } from "@/shared/adapters/ExpressAdapter";

const authRoutes = Router();

/**
 * POST /register
 * Route handler for registering a new user.
 */
authRoutes.post("/register", adaptExpressRoute(makeRegisterUserController()));

export default authRoutes;
