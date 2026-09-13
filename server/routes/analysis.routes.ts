import { Router } from "express";
import {
  createAnalysisRun,
  listProjectAnalysisRuns,
  getAnalysisRunById,
  executeAnalysis,
} from "../controllers/analysis.controller";
import { requireAuth } from "../middleware/auth.middleware";
import {
  requireAnalysisRunOwner,
  requireProjectOwner,
} from "../middleware/authorization.middleware";

const projectAnalysisRunsRouter = Router({ mergeParams: true });
projectAnalysisRunsRouter.use(requireAuth, requireProjectOwner("projectId"));
projectAnalysisRunsRouter.post("/", createAnalysisRun);
projectAnalysisRunsRouter.get("/", listProjectAnalysisRuns);

const analysisRunRouter = Router();
analysisRunRouter.use(requireAuth);
analysisRunRouter.post("/:id/execute", requireAnalysisRunOwner, executeAnalysis);
analysisRunRouter.get("/:id", requireAnalysisRunOwner, getAnalysisRunById);

export { projectAnalysisRunsRouter, analysisRunRouter };
