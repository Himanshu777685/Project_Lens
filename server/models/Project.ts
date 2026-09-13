import { Schema, model, Document, Types } from "mongoose";

export type ProjectStatus = "active" | "archived";

export interface IProject extends Document {
  name: string;
  description?: string;
  status: ProjectStatus;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: String, enum: ["active", "archived"], default: "active" },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", ProjectSchema);