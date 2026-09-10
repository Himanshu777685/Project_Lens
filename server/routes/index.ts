import { Router } from "express";
import healthRoutes from "./health.routes";
import projectRoutes from "./project.routes";
import { projectCommunicationsRouter, communicationRouter } from "./communication.routes";
import { projectAnalysisRunsRouter, analysisRunRouter } from "./analysis.routes";
import { projectInsightsRouter, insightRouter } from "./insight.routes";

/**
 * routes/index.ts
 * ----------------
 * Single place that aggregates all API sub-routers. app.ts only needs to
 * mount this one router under `/api`. Future feature routes (projects,
 * communications, analysis, insights) get added here later — none are
 * added in Phase 3A.
 */

const router = Router();

router.use("/health", healthRoutes);
router.use("/projects", projectRoutes);
router.use("/projects/:projectId/communications", projectCommunicationsRouter);
router.use("/communications", communicationRouter);
router.use("/projects/:projectId/insights", projectInsightsRouter);
router.use("/insights", insightRouter);

// AnalysisRun routes (Phase 3D)
router.use("/projects/:projectId/analysis-runs", projectAnalysisRunsRouter);
router.use("/analysis-runs", analysisRunRouter);

export default router;