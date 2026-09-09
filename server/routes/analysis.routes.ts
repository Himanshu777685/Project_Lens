import { Router } from "express";
import {
  createAnalysisRun,
  listProjectAnalysisRuns,
  getAnalysisRunById,
} from "../controllers/analysis.controller";

const projectAnalysisRunsRouter = Router({ mergeParams: true });
projectAnalysisRunsRouter.post("/", createAnalysisRun);
projectAnalysisRunsRouter.get("/", listProjectAnalysisRuns);

const analysisRunRouter = Router();
analysisRunRouter.get("/:id", getAnalysisRunById);

export { projectAnalysisRunsRouter, analysisRunRouter };
