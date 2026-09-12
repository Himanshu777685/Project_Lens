export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Communication {
  _id: string;
  projectId: string;
  source: CommunicationSource;
  sender: string;
  date: string;
  content: string;
}

export type CommunicationSource =
  | "whatsapp"
  | "email"
  | "meeting"
  | "site"
  | "supplier"
  | "drawing"
  | "voice_note"
  | "other";

export interface AnalysisRun {
  _id: string;
  projectId: string;
  communicationIds: string[];
  status: "pending" | "processing" | "completed" | "failed";
  insightIds: string[];
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

export type InsightType = "decision" | "task" | "change" | "risk" | "conflict";

export interface Insight {
  _id: string;
  projectId: string;
  analysisRunId: string;
  type: InsightType;
  title: string;
  description: string;
  rationale?: string;
  sourceCommunicationIds: string[];
  dependsOnInsightIds?: string[];
  status: string;
  severity?: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
