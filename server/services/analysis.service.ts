import { GoogleGenAI } from "@google/genai";
import { isValidObjectId, Types } from "mongoose";
import { config } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { AnalysisRun, IAnalysisRun } from "../models/AnalysisRun";
import { Communication, ICommunication } from "../models/Communication";
import {
  Insight,
  InsightSeverity,
  InsightStatus,
  InsightType,
} from "../models/Insight";
import { Project } from "../models/Project";

const ALLOWED_TYPES: readonly InsightType[] = [
  "decision",
  "task",
  "change",
  "risk",
  "conflict",
];

const ALLOWED_STATUSES: Record<InsightType, readonly InsightStatus[]> = {
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

interface CandidateInsight {
  type: InsightType;
  title: string;
  description: string;
  status: InsightStatus;
  sourceCommunicationIds: string[];
  rationale?: string;
  severity?: InsightSeverity;
  assignee?: string;
  dueDate?: string;
  dependsOnInsightIds?: string[];
}

interface CommunicationContext {
  id: string;
  source: ICommunication["source"];
  sender: string;
  date: string;
  content: string;
}

function executionError(message: string, statusCode = 502): AppError {
  return new AppError(statusCode, message);
}

function getResponseText(response: { text?: string }): string {
  if (typeof response.text !== "string" || response.text.trim() === "") {
    throw executionError("Gemini returned an empty response.");
  }
  return response.text.trim();
}

function parseModelResponse(text: string): unknown {
  const jsonText = text.startsWith("```")
    ? text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()
    : text;

  try {
    return JSON.parse(jsonText);
  } catch {
    throw executionError("Gemini returned malformed JSON.", 422);
  }
}

function validateCandidate(
  value: unknown,
  allowedCommunicationIds: Set<string>
): CandidateInsight {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw executionError("Gemini returned an invalid insight candidate.", 422);
  }

  const candidate = value as Record<string, unknown>;
  const { type, title, description, status, sourceCommunicationIds } = candidate;

  if (
    typeof type !== "string" ||
    !ALLOWED_TYPES.includes(type as InsightType)
  ) {
    throw executionError("Gemini returned an invalid insight type.", 422);
  }
  const insightType = type as InsightType;

  if (typeof title !== "string" || title.trim() === "") {
    throw executionError("Gemini returned an insight with an empty title.", 422);
  }
  if (
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    throw executionError(
      "Gemini returned an insight with an empty description.",
      422
    );
  }
  if (
    typeof status !== "string" ||
    !ALLOWED_STATUSES[insightType].includes(status as InsightStatus)
  ) {
    throw executionError("Gemini returned an invalid status for an insight type.", 422);
  }
  if (
    !Array.isArray(sourceCommunicationIds) ||
    sourceCommunicationIds.length === 0 ||
    sourceCommunicationIds.some(
      (id) => typeof id !== "string" || !isValidObjectId(id)
    )
  ) {
    throw executionError(
      "Gemini returned invalid sourceCommunicationIds.",
      422
    );
  }

  const sourceIds = sourceCommunicationIds as string[];
  if (sourceIds.some((id) => !allowedCommunicationIds.has(id))) {
    throw executionError(
      "Gemini referenced a communication outside this analysis run.",
      422
    );
  }
  if (insightType === "conflict" && new Set(sourceIds).size < 2) {
    throw executionError(
      "Conflict insights must reference at least two communications.",
      422
    );
  }

  for (const field of ["rationale", "assignee"] as const) {
    if (candidate[field] !== undefined && typeof candidate[field] !== "string") {
      throw executionError(`${field} must be a string if provided.`, 422);
    }
  }

  let dueDate: string | undefined;
  if (candidate.dueDate !== undefined) {
    if (
      typeof candidate.dueDate !== "string" ||
      Number.isNaN(new Date(candidate.dueDate).getTime())
    ) {
      throw executionError("dueDate must be a valid date if provided.", 422);
    }
    dueDate = candidate.dueDate;
  }

  if (
    candidate.severity !== undefined &&
    (typeof candidate.severity !== "string" ||
      !ALLOWED_SEVERITIES.includes(candidate.severity as InsightSeverity))
  ) {
    throw executionError("severity must be low, medium, or high.", 422);
  }

  let dependsOnInsightIds: string[] | undefined;
  if (candidate.dependsOnInsightIds !== undefined) {
    if (
      !Array.isArray(candidate.dependsOnInsightIds) ||
      candidate.dependsOnInsightIds.some(
        (id) => typeof id !== "string" || !isValidObjectId(id)
      )
    ) {
      throw executionError(
        "dependsOnInsightIds must contain valid ids if provided.",
        422
      );
    }
    dependsOnInsightIds = candidate.dependsOnInsightIds as string[];
  }

  return {
    type: insightType,
    title: title.trim(),
    description: description.trim(),
    status: status as InsightStatus,
    sourceCommunicationIds: sourceIds,
    rationale: candidate.rationale as string | undefined,
    severity: candidate.severity as InsightSeverity | undefined,
    assignee: candidate.assignee as string | undefined,
    dueDate,
    dependsOnInsightIds,
  };
}

function buildPrompt(communications: CommunicationContext[]): string {
  return `You are ProjectLens's evidence-based project communication analyst.
Return ONLY valid JSON matching this exact shape:
{"insights":[{"type":"decision|task|change|risk|conflict","title":"string","description":"string","status":"string","sourceCommunicationIds":["communication id"],"rationale":"string","severity":"low|medium|high","assignee":"string","dueDate":"ISO date","dependsOnInsightIds":[]}]}

Identify only evidence-supported decisions, actionable tasks, meaningful changes,
risks, and conflicts. Do not fabricate or assume approvals. Do not invent people,
dates, responsibilities, or decisions. Every insight must cite one or more
provided communication IDs and may reference only those IDs. Use an empty array
for dependsOnInsightIds unless a valid existing dependency is explicitly provided.
Use the valid status for each type. Omit optional fields when unsupported.

Communications (preserve these IDs exactly):
${JSON.stringify(communications)}`;
}

async function markFailed(runId: Types.ObjectId, error: unknown): Promise<never> {
  const message =
    error instanceof AppError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Analysis execution failed.";
  await AnalysisRun.findByIdAndUpdate(runId, {
    status: "failed",
    errorMessage: message,
    completedAt: new Date(),
  });
  throw error instanceof AppError ? error : executionError(message, 500);
}

export async function executeAnalysisRun(runId: string): Promise<IAnalysisRun> {
  const initialRun = await AnalysisRun.findById(runId);
  if (!initialRun) {
    throw new AppError(404, "AnalysisRun not found.");
  }
  if (initialRun.status !== "pending") {
    throw new AppError(409, "Only pending AnalysisRuns can be executed.");
  }

  const run = await AnalysisRun.findOneAndUpdate(
    { _id: runId, status: "pending" },
    { $set: { status: "processing", startedAt: new Date(), errorMessage: undefined } },
    { new: true }
  );
  if (!run) {
    throw new AppError(409, "AnalysisRun is already being executed.");
  }

  try {
    const project = await Project.findById(run.projectId).select("_id");
    if (!project) {
      throw new AppError(404, "Project for AnalysisRun not found.");
    }
    if (!config.geminiApiKey) {
      throw executionError("Gemini API key is not configured.", 503);
    }

    const communications = await Communication.find({
      _id: { $in: run.communicationIds },
    }).select("_id source sender date content");
    const communicationById = new Map(
      communications.map((communication) => [communication._id.toString(), communication])
    );
    const selectedCommunications = run.communicationIds.map((id) => {
      const communication = communicationById.get(id.toString());
      if (!communication) {
        throw new AppError(404, `Communication not found: ${id.toString()}.`);
      }
      if (communication.projectId.toString() !== run.projectId.toString()) {
        throw new AppError(400, "AnalysisRun contains a cross-project communication.");
      }
      return {
        id: communication._id.toString(),
        source: communication.source,
        sender: communication.sender,
        date: communication.date.toISOString(),
        content: communication.content,
      };
    });

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: buildPrompt(selectedCommunications),
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });
    const parsed = parseModelResponse(getResponseText(response));
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      !Array.isArray((parsed as { insights?: unknown }).insights)
    ) {
      throw executionError("Gemini returned an invalid insights response.", 422);
    }

    const allowedCommunicationIds = new Set(
      selectedCommunications.map((communication) => communication.id)
    );
    const candidates = (parsed as { insights: unknown[] }).insights.map((candidate) =>
      validateCandidate(candidate, allowedCommunicationIds)
    );
    const uniqueCandidates = candidates.filter(
      (candidate, index, all) =>
        all.findIndex(
          (other) =>
            other.type === candidate.type &&
            other.title.toLowerCase() === candidate.title.toLowerCase() &&
            other.description.toLowerCase() === candidate.description.toLowerCase()
        ) === index
    );

    const dependencyIds = new Set(
      uniqueCandidates.flatMap((candidate) => candidate.dependsOnInsightIds ?? [])
    );
    if (dependencyIds.size > 0) {
      const dependencies = await Insight.find({
        _id: { $in: [...dependencyIds] },
        projectId: run.projectId,
      }).select("_id");
      if (dependencies.length !== dependencyIds.size) {
        throw executionError("Gemini returned an invalid insight dependency.", 422);
      }
    }

    const createdInsights = await Insight.insertMany(
      uniqueCandidates.map((candidate) => ({
        ...candidate,
        projectId: run.projectId,
        analysisRunId: run._id,
        sourceCommunicationIds: candidate.sourceCommunicationIds.map(
          (id) => new Types.ObjectId(id)
        ),
        dependsOnInsightIds: candidate.dependsOnInsightIds?.map(
          (id) => new Types.ObjectId(id)
        ),
        dueDate: candidate.dueDate ? new Date(candidate.dueDate) : undefined,
      }))
    );
    const insightIds = createdInsights.map((insight) => insight._id);
    return await AnalysisRun.findByIdAndUpdate(
      run._id,
      {
        status: "completed",
        insightIds,
        completedAt: new Date(),
        errorMessage: undefined,
      },
      { new: true }
    ) as IAnalysisRun;
  } catch (error) {
    return markFailed(run._id, error);
  }
}
