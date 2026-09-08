import { Schema, model, Document } from "mongoose";

export type ProjectStatus = "active" | "archived";

export interface IProject extends Document {
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", ProjectSchema);