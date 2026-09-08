import { Router, Request, Response } from "express";

/**
 * routes/health.routes.ts
 * ------------------------
 * A minimal liveness check. Deliberately does not touch Gemini, the
 * database, or any project data — it only confirms the API process
 * itself is up and responding.
 */

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "projectlens-api",
  });
});

export default router;