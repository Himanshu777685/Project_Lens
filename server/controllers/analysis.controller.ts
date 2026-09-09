import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { AnalysisRun } from "../models/AnalysisRun";
import { Communication } from "../models/Communication";
import { Project } from "../models/Project";
import { AppError } from "../middleware/errorHandler";

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

async function requireExistingProject(projectId: string): Promise<void> {
  if (!isValidObjectId(projectId)) {
    throw new AppError(400, "Invalid project id.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(404, "Project not found.");
  }
}

export const createAnalysisRun = catchAsync(async (req, res) => {
  const projectId = req.params.projectId as string;

  await requireExistingProject(projectId);

  const { communicationIds } = req.body ?? {};

  if (!Array.isArray(communicationIds)) {
    throw new AppError(400, "communicationIds is required and must be a non-empty array.");
  }

  if (communicationIds.length === 0) {
    throw new AppError(400, "communicationIds must contain at least one id.");
  }

  // Validate each communication id
  for (const id of communicationIds) {
    if (!isValidObjectId(id)) {
      throw new AppError(400, `Invalid communication id: ${id}`);
    }
  }

  // Fetch communications and ensure they all exist
  const communications = await Communication.find({ _id: { $in: communicationIds } });

  if (communications.length !== communicationIds.length) {
    const foundIds = new Set(communications.map((c) => c._id.toString()));
    const missing = communicationIds.filter((id: string) => !foundIds.has(id.toString()));
    throw new AppError(404, `Communication(s) not found: ${missing.join(", ")}`);
  }

  // Ensure all communications belong to the specified project
  const foreign = communications.filter((c) => c.projectId.toString() !== projectId);
  if (foreign.length > 0) {
    const foreignIds = foreign.map((f) => f._id.toString());
    throw new AppError(
      400,
      `One or more communications do not belong to the specified project: ${foreignIds.join(", ")}`
    );
  }

  // Create AnalysisRun and always start with status "pending" (ignore client-supplied status)
  const analysisRun = await AnalysisRun.create({
    projectId,
    communicationIds,
    status: "pending",
  });

  res.status(201).json({ success: true, data: analysisRun });
});

export const listProjectAnalysisRuns = catchAsync(async (req, res) => {
  const projectId = req.params.projectId as string;

  await requireExistingProject(projectId);

  const runs = await AnalysisRun.find({ projectId }).sort({ startedAt: -1 });

  res.status(200).json({ success: true, data: runs });
});

export const getAnalysisRunById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError(400, "Invalid analysisRun id.");
  }

  const run = await AnalysisRun.findById(id);

  if (!run) {
    throw new AppError(404, "AnalysisRun not found.");
  }

  res.status(200).json({ success: true, data: run });
});
