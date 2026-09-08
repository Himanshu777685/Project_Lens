import { Schema, model, Document, Types } from "mongoose";

/**
 * Insight
 * -------
 * The unified model for every AI-extracted piece of project intelligence:
 * decisions, tasks, changes, risks, and conflicts. One collection, one
 * schema, distinguished by the `type` field — see Phase 2A architecture
 * for why this is preferred over five separate collections.
 *
 * The single most important field on this model is
 * `sourceCommunicationIds`: every Insight must be traceable back to at
 * least one original Communication. That requirement is enforced below.
 */

export type InsightType = "decision" | "task" | "change" | "risk" | "conflict";

export type DecisionStatus = "proposed" | "confirmed" | "rejected";
export type TaskStatus = "open" | "in_progress" | "completed";
export type ChangeStatus = "recorded";
export type RiskStatus = "open" | "mitigated";
export type ConflictStatus = "open" | "resolved";

export type InsightStatus =
  | DecisionStatus
  | TaskStatus
  | ChangeStatus
  | RiskStatus
  | ConflictStatus;

export type InsightSeverity = "low" | "medium" | "high";

export interface IInsight extends Document {
  projectId: Types.ObjectId;
  analysisRunId: Types.ObjectId;
  type: InsightType;
  title: string;
  description: string;
  rationale?: string;
  sourceCommunicationIds: Types.ObjectId[];
  dependsOnInsightIds?: Types.ObjectId[];
  status: InsightStatus;
  assignee?: string;
  dueDate?: Date;
  severity?: InsightSeverity;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Single lookup table mapping each Insight type to the status values
 * that are valid for it. This is the entire "business rule" — everything
 * else is a thin Mongoose validator that reads from this table.
 */
const ALLOWED_STATUSES_BY_TYPE: Record<InsightType, readonly string[]> = {
  decision: ["proposed", "confirmed", "rejected"],
  task: ["open", "in_progress", "completed"],
  change: ["recorded"],
  risk: ["open", "mitigated"],
  conflict: ["open", "resolved"],
};

const InsightSchema = new Schema<IInsight>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    analysisRunId: {
      type: Schema.Types.ObjectId,
      ref: "AnalysisRun",
      required: true,
    },
    type: {
      type: String,
      enum: ["decision", "task", "change", "risk", "conflict"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rationale: {
      type: String,
      required: false,
    },
    sourceCommunicationIds: {
      type: [Schema.Types.ObjectId],
      ref: "Communication",
      required: true,
      validate: {
        validator: (value: Types.ObjectId[]): boolean =>
          Array.isArray(value) && value.length >= 1,
        message:
          "sourceCommunicationIds must contain at least one Communication id.",
      },
    },
    dependsOnInsightIds: {
      type: [Schema.Types.ObjectId],
      ref: "Insight",
      required: false,
    },
    status: {
      type: String,
      required: true,
      validate: {
        // Mongoose's own typings for `this` inside a validator are a large
        // internal union (hydrated document | query) that we don't need in
        // full. We accept `this: any` at the boundary and immediately cast
        // to a minimal local shape, so everything after that line is typed.
        validator: function (this: any, value: string): boolean {
          const insightType = (this as { type?: InsightType }).type;
          if (!insightType) return false;
          const allowed = ALLOWED_STATUSES_BY_TYPE[insightType];
          return allowed ? allowed.includes(value) : false;
        },
        message: function (props: { value: string }): string {
          return `"${props.value}" is not a valid status for this insight type.`;
        },
      },
    },
    assignee: {
      type: String,
      required: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Powers the Project Truth tabs and Dashboard counts (filter by project +
// type + status all at once).
InsightSchema.index({ projectId: 1, type: 1, status: 1 });

// Enables the reverse lookup: "which insights came from this communication".
InsightSchema.index({ sourceCommunicationIds: 1 });

export const Insight = model<IInsight>("Insight", InsightSchema);