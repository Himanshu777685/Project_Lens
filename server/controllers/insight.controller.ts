import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { AnalysisRun } from "../models/AnalysisRun";
import {
  Insight,
  InsightSeverity,
  InsightStatus,
  InsightType,
} from "../models/Insight";
import { Communication } from "../models/Communication";
import { Project } from "../models/Project";
import { AppError } from "../middleware/errorHandler";

const ALLOWED_TYPES: readonly InsightType[] = [
  "decision",
  "task",
  "change",
  "risk",
  "conflict",
];

const ALLOWED_STATUSES_BY_TYPE: Record<InsightType, readonly string[]> = {
  decision: ["proposed", "confirmed", "rejected"],
  task: ["open", "in_progress", "completed"],
  change: ["recorded"],
  risk: ["open", "mitigated"],
  conflict: ["open", "resolved"],
};

const ALLOWED_SEVERITIES: readonly InsightSeverity[] = [
  "low",
  "medium",
  "high",
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

async function requireExistingProject(projectId: string): Promise<void> {
  if (!isValidObjectId(projectId)) {
    throw new AppError(400, "Invalid project id.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(404, "Project not found.");
  }
}

export const createInsight = catchAsync(async (req, res) => {
  const projectId = req.params.projectId as string;

  await requireExistingProject(projectId);

  const {
    analysisRunId,
    type,
    title,
    description,
    sourceCommunicationIds,
    status,
    rationale,
    assignee,
    dueDate,
    severity,
    dependsOnInsightIds,
  } = req.body ?? {};

  if (typeof analysisRunId !== "string" || !isValidObjectId(analysisRunId)) {
    throw new AppError(400, "analysisRunId is required and must be a valid id.");
  }

  if (typeof type !== "string" || !ALLOWED_TYPES.includes(type as InsightType)) {
    throw new AppError(
      400,
      `type is required and must be one of: ${ALLOWED_TYPES.join(", ")}.`
    );
  }

  if (typeof title !== "string" || title.trim() === "") {
    throw new AppError(400, "title is required and cannot be empty.");
  }

  if (typeof description !== "string" || description.trim() === "") {
    throw new AppError(400, "description is required and cannot be empty.");
  }

  if (!Array.isArray(sourceCommunicationIds) || sourceCommunicationIds.length === 0) {
    throw new AppError(
      400,
      "sourceCommunicationIds is required and must be a non-empty array."
    );
  }

  if (
    sourceCommunicationIds.some(
      (communicationId: unknown) =>
        typeof communicationId !== "string" || !isValidObjectId(communicationId)
    )
  ) {
    throw new AppError(
      400,
      "Every sourceCommunicationIds value must be a valid id."
    );
  }

  if (
    typeof status !== "string" ||
    !ALLOWED_STATUSES_BY_TYPE[type as InsightType].includes(status)
  ) {
    throw new AppError(400, `Invalid status for insight type "${type}".`);
  }

  if (rationale !== undefined && typeof rationale !== "string") {
    throw new AppError(400, "rationale must be a string if provided.");
  }

  if (assignee !== undefined && typeof assignee !== "string") {
    throw new AppError(400, "assignee must be a string if provided.");
  }

  let parsedDueDate: Date | undefined;
  if (dueDate !== undefined) {
    parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) {
      throw new AppError(400, "dueDate must be a valid date if provided.");
    }
  }

  if (
    severity !== undefined &&
    (typeof severity !== "string" ||
      !ALLOWED_SEVERITIES.includes(severity as InsightSeverity))
  ) {
    throw new AppError(400, "severity must be one of: low, medium, high.");
  }

  if (dependsOnInsightIds !== undefined) {
    if (
      !Array.isArray(dependsOnInsightIds) ||
      dependsOnInsightIds.some(
        (insightId: unknown) =>
          typeof insightId !== "string" || !isValidObjectId(insightId)
      )
    ) {
      throw new AppError(
        400,
        "dependsOnInsightIds must be an array of valid ids if provided."
      );
    }
  }

  const analysisRun = await AnalysisRun.findById(analysisRunId);
  if (!analysisRun) {
    throw new AppError(404, "Analysis run not found.");
  }

  if (analysisRun.projectId.toString() !== projectId) {
    throw new AppError(400, "Analysis run does not belong to the project.");
  }

  const communications = await Communication.find({
    _id: { $in: sourceCommunicationIds },
    projectId,
  }).select("_id");

  if (communications.length !== new Set(sourceCommunicationIds).size) {
    throw new AppError(
      400,
      "Every source communication must exist and belong to the project."
    );
  }

  if (dependsOnInsightIds !== undefined) {
    const referencedInsights = await Insight.find({
      _id: { $in: dependsOnInsightIds },
      projectId,
    }).select("_id");

    if (referencedInsights.length !== new Set(dependsOnInsightIds).size) {
      throw new AppError(
        400,
        "Every dependent insight must exist and belong to the project."
      );
    }
  }

  const insight = await Insight.create({
    projectId,
    analysisRunId,
    type: type as InsightType,
    title: title.trim(),
    description: description.trim(),
    sourceCommunicationIds,
    status: status as InsightStatus,
    rationale: typeof rationale === "string" ? rationale : undefined,
    assignee: typeof assignee === "string" ? assignee : undefined,
    dueDate: parsedDueDate,
    severity,
    dependsOnInsightIds,
  });

  res.status(201).json({ success: true, data: insight });
});

export const listProjectInsights = catchAsync(async (req, res) => {
  const projectId = req.params.projectId as string;

  await requireExistingProject(projectId);

  const insights = await Insight.find({ projectId }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: insights });
});

export const getInsightById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError(400, "Invalid insight id.");
  }

  const insight = await Insight.findById(id);

  if (!insight) {
    throw new AppError(404, "Insight not found.");
  }

  res.status(200).json({ success: true, data: insight });
});

export const updateInsightStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new AppError(400, "Invalid insight id.");
  }

  const { status } = req.body ?? {};
  if (typeof status !== "string") {
    throw new AppError(400, "status is required.");
  }

  const insight = await Insight.findById(id);
  if (!insight) {
    throw new AppError(404, "Insight not found.");
  }

  const allowedStatuses = ALLOWED_STATUSES_BY_TYPE[insight.type];
  if (!allowedStatuses.includes(status)) {
    throw new AppError(400, `Invalid status for insight type "${insight.type}".`);
  }

  insight.status = status as InsightStatus;
  await insight.save();

  res.status(200).json({ success: true, data: insight });
});
