import { Schema, model, Document, Types } from "mongoose";

export type AnalysisRunStatus = "pending" | "processing" | "completed" | "failed";

export interface IAnalysisRun extends Document {
  projectId: Types.ObjectId;
  communicationIds: Types.ObjectId[];
  status: AnalysisRunStatus;
  insightIds: Types.ObjectId[];
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisRunSchema = new Schema<IAnalysisRun>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    communicationIds: { type: [Schema.Types.ObjectId], ref: "Communication", required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      required: true,
      default: "pending",
    },
    insightIds: { type: [Schema.Types.ObjectId], ref: "Insight", default: [] },
    errorMessage: { type: String, required: false },
    startedAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date, required: false },
  },
  { timestamps: true }
);

AnalysisRunSchema.index({ projectId: 1, startedAt: -1 });

export const AnalysisRun = model<IAnalysisRun>("AnalysisRun", AnalysisRunSchema);