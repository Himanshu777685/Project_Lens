import dotenv from "dotenv";

dotenv.config();

/**
 * config/env.ts
 * -------------
 * Loads environment variables once, validates the ones the app cannot
 * run without, and exports a small typed config object so the rest of
 * the app never touches `process.env` directly.
 */

interface AppConfig {
  port: number;
  mongodbUri: string;
  clientUrl: string;
  nodeEnv: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env file (see .env.example).`
    );
  }
  return value;
}

const rawPort = process.env.PORT ?? "5000";
const parsedPort = Number(rawPort);

if (Number.isNaN(parsedPort)) {
  throw new Error(`Invalid PORT value: "${rawPort}". PORT must be a number.`);
}

export const config: AppConfig = {
  port: parsedPort,
  mongodbUri: requireEnv("MONGODB_URI"),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV ?? "development",
};