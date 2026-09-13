import { Router } from "express";
import {
  createCommunication,
  listProjectCommunications,
  getCommunicationById,
} from "../controllers/communication.controller";
import { requireAuth } from "../middleware/auth.middleware";
import {
  requireCommunicationOwner,
  requireProjectOwner,
} from "../middleware/authorization.middleware";

/**
 * routes/communication.routes.ts
 * ---------------------------------
 * Exports two separate routers because the two URL shapes have different
 * parents:
 *
 *   projectCommunicationsRouter  -> mounted at /api/projects/:projectId/communications
 *   communicationRouter          -> mounted at /api/communications
 *
 * `mergeParams: true` on projectCommunicationsRouter is required so its
 * handlers can read `req.params.projectId`, which is captured by the
 * parent mount path in routes/index.ts rather than by this router itself.
 */

const projectCommunicationsRouter = Router({ mergeParams: true });
projectCommunicationsRouter.use(requireAuth, requireProjectOwner("projectId"));
projectCommunicationsRouter.post("/", createCommunication);
projectCommunicationsRouter.get("/", listProjectCommunications);

const communicationRouter = Router();
communicationRouter.use(requireAuth);
communicationRouter.get("/:id", requireCommunicationOwner, getCommunicationById);

export { projectCommunicationsRouter, communicationRouter };