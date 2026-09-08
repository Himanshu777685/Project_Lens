import { Request, Response } from "express";

/**
 * middleware/notFound.ts
 * -----------------------
 * Mounted after all real routes. Anything that reaches here didn't match
 * a defined route, so we return a consistent JSON 404 instead of Express's
 * default HTML error page.
 */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
