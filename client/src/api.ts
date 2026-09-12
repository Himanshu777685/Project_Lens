import type { Communication, CommunicationSource, Project } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new ApiError(
      payload && "message" in payload && payload.message
        ? payload.message
        : "The request could not be completed.",
      response.status
    );
  }

  if (!payload || !("success" in payload) || !payload.success) {
    throw new ApiError("The API returned an unexpected response.", response.status);
  }

  return payload.data;
}

export function listProjects(): Promise<Project[]> {
  return request<Project[]>("/projects");
}

export function createProject(project: {
  name: string;
  description?: string;
}): Promise<Project> {
  return request<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export function getProject(id: string): Promise<Project> {
  return request<Project>(`/projects/${encodeURIComponent(id)}`);
}

export function updateProjectStatus(
  id: string,
  status: Project["status"]
): Promise<Project> {
  return request<Project>(`/projects/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function listProjectCommunications(projectId: string): Promise<Communication[]> {
  return request<Communication[]>(
    `/projects/${encodeURIComponent(projectId)}/communications`
  );
}

export function createCommunication(
  projectId: string,
  communication: {
    source: CommunicationSource;
    sender: string;
    date: string;
    content: string;
  }
): Promise<Communication> {
  return request<Communication>(
    `/projects/${encodeURIComponent(projectId)}/communications`,
    {
      method: "POST",
      body: JSON.stringify(communication),
    }
  );
}
