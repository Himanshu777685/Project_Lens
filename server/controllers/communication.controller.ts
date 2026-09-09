import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { Communication, CommunicationSource } from "../models/Communication";
import { Project } from "../models/Project";
import { AppError } from "../middleware/errorHandler";

/**
 * controllers/communication.controller.ts
 * ------------------------------------------
 * Direct Mongoose-model CRUD (create + read) for the Communication
 * resource, scoped to a Project. Follows the same conventions as
 * project.controller.ts: no repository/service layer, a local
 * `catchAsync` wrapper instead of repeated try/catch, and the existing
 * `AppError` + centralized error middleware for all error responses.
 */

const ALLOWED_SOURCES: readonly CommunicationSource[] = [
  "whatsapp",
  "email",
  "meeting",
  "site",
  "supplier",
  "drawing",
  "voice_note",
  "other",
];

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

/**
 * Confirms a project exists before any communication is created or
 * listed for it. Throws the same 400/404 pair used everywhere else.
 */
async function requireExistingProject(projectId: string): Promise<void> {
  if (!isValidObjectId(projectId)) {
    throw new AppError(400, "Invalid project id.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(404, "Project not found.");
  }
}

export const createCommunication = catchAsync(async (req, res) => {
  const projectId  = req.params.projectId as string;

  await requireExistingProject(projectId);

  // projectId is taken only from the URL. Even if a client sends
  // "projectId" in the body, it is never read here.
  const { source, sender, date, content, metadata } = req.body ?? {};

  if (typeof source !== "string" || !ALLOWED_SOURCES.includes(source as CommunicationSource)) {
    throw new AppError(
      400,
      `source is required and must be one of: ${ALLOWED_SOURCES.join(", ")}.`
    );
  }

  if (typeof sender !== "string" || sender.trim() === "") {
    throw new AppError(400, "sender is required and cannot be empty.");
  }

  if (typeof content !== "string" || content.trim() === "") {
    throw new AppError(400, "content is required and cannot be empty.");
  }

  if (date === undefined || date === null || date === "") {
    throw new AppError(400, "date is required.");
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(400, "date must be a valid date.");
  }

  if (
    metadata !== undefined &&
    (typeof metadata !== "object" || metadata === null || Array.isArray(metadata))
  ) {
    throw new AppError(400, "metadata must be an object if provided.");
  }

  const communication = await Communication.create({
    projectId,
    source: source as CommunicationSource,
    sender: sender.trim(),
    date: parsedDate,
    content: content.trim(),
    metadata,
  });

  res.status(201).json({ success: true, data: communication });
});

export const listProjectCommunications = catchAsync(async (req, res) => {
  const projectId = req.params.projectId as string;

  await requireExistingProject(projectId);

  const communications = await Communication.find({ projectId }).sort({ date: -1 });

  res.status(200).json({ success: true, data: communications });
});

export const getCommunicationById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError(400, "Invalid communication id.");
  }

  const communication = await Communication.findById(id);

  if (!communication) {
    throw new AppError(404, "Communication not found.");
  }

  res.status(200).json({ success: true, data: communication });
});