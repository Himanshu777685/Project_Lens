import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  archiveProject,
  deleteProject,
} from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireProjectOwner } from "../middleware/authorization.middleware";

/**
 * routes/project.routes.ts
 * --------------------------
 * Mounted under /api/projects by routes/index.ts.
 */

const router = Router();

router.use(requireAuth);
router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", requireProjectOwner("id"), getProjectById);
router.patch("/:id", requireProjectOwner("id"), updateProject);
router.patch("/:id/archive", requireProjectOwner("id"), archiveProject);
router.delete("/:id", requireProjectOwner("id"), deleteProject);

export default router;