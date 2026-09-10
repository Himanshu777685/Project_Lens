import { Router } from "express";
import {
  createInsight,
  getInsightById,
  listProjectInsights,
} from "../controllers/insight.controller";

const projectInsightsRouter = Router({ mergeParams: true });
projectInsightsRouter.post("/", createInsight);
projectInsightsRouter.get("/", listProjectInsights);

const insightRouter = Router();
insightRouter.get("/:id", getInsightById);

export { projectInsightsRouter, insightRouter };
