import mongoose from "mongoose";
import { config } from "./env";

/**
 * config/db.ts
 * ------------
 * Owns the MongoDB connection lifecycle. Does NOT define any schemas or
 * models — those live in server/models/ and are untouched by this file.
 */

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error("[db] MongoDB connection failed:", error);
    throw error;
  }
}