import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  archiveProject,
} from "../controllers/project.controller";

/**
 * routes/project.routes.ts
 * --------------------------
 * Mounted under /api/projects by routes/index.ts.
 */

const router = Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.patch("/:id/archive", archiveProject);

export default router;