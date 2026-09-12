import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { Project } from "../models/Project";
import { AppError } from "../middleware/errorHandler";

/**
 * controllers/project.controller.ts
 * -----------------------------------
 * Direct Mongoose-model CRUD for the Project resource. No repository or
 * service layer — this is intentionally thin per Phase 3B scope.
 *
 * Every handler is wrapped in `catchAsync` so a thrown/rejected error is
 * forwarded to the centralized error middleware from Phase 3A instead of
 * needing a try/catch block repeated in every handler.
 */

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

function catchAsync(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

export const createProject = catchAsync(async (req, res) => {
  const { name, description } = req.body ?? {};

  if (typeof name !== "string" || name.trim() === "") {
    throw new AppError(400, "Project name is required.");
  }

  if (description !== undefined && typeof description !== "string") {
    throw new AppError(400, "Project description must be a string.");
  }

  // Only these two fields are ever read from the client. `status` is
  // always set explicitly here so a client cannot create an already
  // archived project by sending `"status": "archived"` in the body.
  const project = await Project.create({
    name: name.trim(),
    description: typeof description === "string" ? description.trim() : undefined,
    status: "active",
  });

  res.status(201).json({ success: true, data: project });
});

export const getAllProjects = catchAsync(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: projects });
});

export const getProjectById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError(400, "Invalid project id.");
  }

  const project = await Project.findById(id);

  if (!project) {
    throw new AppError(404, "Project not found.");
  }

  res.status(200).json({ success: true, data: project });
});

export const updateProject = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError(400, "Invalid project id.");
  }

  const body = req.body ?? {};
  const { name, description, status } = body;
  const allowedFields = new Set(["name", "description", "status"]);
  const unknownField = Object.keys(body).find((field) => !allowedFields.has(field));
  if (unknownField) {
    throw new AppError(400, `Field "${unknownField}" cannot be updated.`);
  }

  const updates: { name?: string; description?: string; status?: "active" | "archived" } = {};

  // PATCH semantics: only fields explicitly present in the body are touched.
  // Timestamps and ownership fields are not accepted as update fields.
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      throw new AppError(400, "Project name cannot be empty.");
    }
    updates.name = name.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new AppError(400, "Project description must be a string.");
    }
    updates.description = description.trim();
  }

  if (status !== undefined) {
    if (status !== "active" && status !== "archived") {
      throw new AppError(400, "Project status must be active or archived.");
    }
    updates.status = status;
  }

  const project = await Project.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    throw new AppError(404, "Project not found.");
  }

  res.status(200).json({ success: true, data: project });
});

export const archiveProject = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError(400, "Invalid project id.");
  }

  const project = await Project.findByIdAndUpdate(
    id,
    { status: "archived" },
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new AppError(404, "Project not found.");
  }

  res.status(200).json({ success: true, data: project });
});