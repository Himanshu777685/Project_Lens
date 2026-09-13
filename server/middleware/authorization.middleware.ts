import { Request, RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";
import { AnalysisRun } from "../models/AnalysisRun";
import { Communication } from "../models/Communication";
import { Insight } from "../models/Insight";
import { Project } from "../models/Project";
import { AppError } from "./errorHandler";
import "../types/auth";

type ProjectParam = "id" | "projectId";

function requireUserId(req: Request): Types.ObjectId {
  if (!req.user) {
    throw new AppError(401, "Authentication required.");
  }
  return req.user.userId;
}

async function assertProjectOwner(projectId: string, userId: Types.ObjectId): Promise<void> {
  if (!isValidObjectId(projectId)) {
    throw new AppError(400, "Invalid project id.");
  }

  const project = await Project.findById(projectId).select("ownerId");
  if (!project) {
    throw new AppError(404, "Project not found.");
  }
  if (project.ownerId.toString() !== userId.toString()) {
    throw new AppError(403, "You are not authorized to access this project.");
  }
}

export function requireProjectOwner(param: ProjectParam): RequestHandler {
  return async (req, _res, next) => {
    try {
      await assertProjectOwner(req.params[param] as string, requireUserId(req));
      next();
    } catch (error) {
      next(error);
    }
  };
}

async function assertResourceProjectOwner(
  projectId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<void> {
  await assertProjectOwner(projectId.toString(), userId);
}

export const requireCommunicationOwner: RequestHandler = async (req, _res, next) => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      throw new AppError(400, "Invalid communication id.");
    }
    const communication = await Communication.findById(id).select("projectId");
    if (!communication) {
      throw new AppError(404, "Communication not found.");
    }
    await assertResourceProjectOwner(communication.projectId, requireUserId(req));
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAnalysisRunOwner: RequestHandler = async (req, _res, next) => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      throw new AppError(400, "Invalid analysisRun id.");
    }
    const run = await AnalysisRun.findById(id).select("projectId");
    if (!run) {
      throw new AppError(404, "AnalysisRun not found.");
    }
    await assertResourceProjectOwner(run.projectId, requireUserId(req));
    next();
  } catch (error) {
    next(error);
  }
};

export const requireInsightOwner: RequestHandler = async (req, _res, next) => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      throw new AppError(400, "Invalid insight id.");
    }
    const insight = await Insight.findById(id).select("projectId");
    if (!insight) {
      throw new AppError(404, "Insight not found.");
    }
    await assertResourceProjectOwner(insight.projectId, requireUserId(req));
    next();
  } catch (error) {
    next(error);
  }
};
