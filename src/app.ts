import "reflect-metadata";
import connectToDatabase from "@/shared/config/db";

/**
 * Application bootstrap function.
 * Only initializes core services (like DB, DI, etc.)
 */
export const bootstrapApp = async () => {
  await connectToDatabase();
};
