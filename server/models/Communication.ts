import { Schema, model, Document, Types } from "mongoose";

export type CommunicationSource =
  | "whatsapp" | "email" | "meeting" | "site"
  | "supplier" | "drawing" | "voice_note" | "other";

export interface ICommunication extends Document {
  projectId: Types.ObjectId;
  source: CommunicationSource;
  sender: string;
  date: Date;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const CommunicationSchema = new Schema<ICommunication>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    source: {
      type: String,
      enum: ["whatsapp", "email", "meeting", "site", "supplier", "drawing", "voice_note", "other"],
      required: true,
    },
    sender: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

CommunicationSchema.index({ projectId: 1, date: -1 });
CommunicationSchema.index({ projectId: 1, source: 1 });

export const Communication = model<ICommunication>("Communication", CommunicationSchema);