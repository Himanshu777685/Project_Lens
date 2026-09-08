import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

/**
 * middleware/errorHandler.ts
 * ---------------------------
 * One centralized place to turn any thrown/passed error into a consistent
 * JSON response, so individual routes/controllers don't need repeated
 * try/catch + response-formatting logic.
 */

/**
 * Small optional error class for future routes/controllers that want to
 * throw an error with a specific HTTP status code (e.g. `throw new AppError(404, "Project not found")`).
 * Not used anywhere in Phase 3A itself, since no feature routes exist yet.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Unexpected server error";

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  const isProduction = config.nodeEnv === "production";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}