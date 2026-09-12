import { Router } from "express";
import {
  createInsight,
  getInsightById,
  listProjectInsights,
  updateInsightStatus,
} from "../controllers/insight.controller";

const projectInsightsRouter = Router({ mergeParams: true });
projectInsightsRouter.post("/", createInsight);
projectInsightsRouter.get("/", listProjectInsights);

const insightRouter = Router();
insightRouter.get("/:id", getInsightById);
insightRouter.patch("/:id", updateInsightStatus);

export { projectInsightsRouter, insightRouter };
