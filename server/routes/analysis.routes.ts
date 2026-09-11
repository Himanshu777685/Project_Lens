import { Router } from "express";
import {
  createAnalysisRun,
  listProjectAnalysisRuns,
  getAnalysisRunById,
  executeAnalysis,
} from "../controllers/analysis.controller";

const projectAnalysisRunsRouter = Router({ mergeParams: true });
projectAnalysisRunsRouter.post("/", createAnalysisRun);
projectAnalysisRunsRouter.get("/", listProjectAnalysisRuns);

const analysisRunRouter = Router();
analysisRunRouter.post("/:id/execute", executeAnalysis);
analysisRunRouter.get("/:id", getAnalysisRunById);

export { projectAnalysisRunsRouter, analysisRunRouter };
