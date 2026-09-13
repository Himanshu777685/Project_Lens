import { Router } from "express";
import {
  createInsight,
  getInsightById,
  listProjectInsights,
  updateInsightStatus,
} from "../controllers/insight.controller";
import { requireAuth } from "../middleware/auth.middleware";
import {
  requireInsightOwner,
  requireProjectOwner,
} from "../middleware/authorization.middleware";

const projectInsightsRouter = Router({ mergeParams: true });
projectInsightsRouter.use(requireAuth, requireProjectOwner("projectId"));
projectInsightsRouter.post("/", createInsight);
projectInsightsRouter.get("/", listProjectInsights);

const insightRouter = Router();
insightRouter.use(requireAuth);
insightRouter.get("/:id", requireInsightOwner, getInsightById);
insightRouter.patch("/:id", requireInsightOwner, updateInsightStatus);

export { projectInsightsRouter, insightRouter };
