import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject, listProjectCommunications } from "../api";
import { CommunicationForm } from "../components/CommunicationForm";
import { StatusMessage } from "../components/StatusMessage";
import type { Communication, Project } from "../types";

export function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project>();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadWorkspace = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(undefined);
    try {
      const [projectData, communicationData] = await Promise.all([
        getProject(projectId),
        listProjectCommunications(projectId),
      ]);
      setProject(projectData);
      setCommunications(communicationData);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to load project workspace.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  if (!projectId) {
    return <StatusMessage title="Project not found." tone="error" />;
  }

  return (
    <section className="page-section">
      <Link className="back-link" to="/">← Back to projects</Link>
      {isLoading && <StatusMessage title="Loading communications..." />}
      {error && (
        <div>
          <StatusMessage
            title="Project workspace could not be loaded."
            detail={error}
            tone="error"
          />
          <button className="retry-button" type="button" onClick={() => void loadWorkspace()}>
            Retry
          </button>
        </div>
      )}
      {!isLoading && !error && project && (
        <>
          <div className="workspace-heading">
            <div>
              <p className="eyebrow">Project workspace</p>
              <h1>{project.name}</h1>
              <p className="lede">{project.description || "Project communications and source records."}</p>
            </div>
            <span className={`project-status project-status--${project.status}`}>{project.status}</span>
          </div>
          <div className="inbox-toolbar">
            <div>
              <h2>Communication inbox</h2>
              <p>{communications.length} {communications.length === 1 ? "record" : "records"}</p>
            </div>
            {!isFormOpen && (
              <button className="primary-button" type="button" onClick={() => setIsFormOpen(true)}>
                Add communication
              </button>
            )}
          </div>
          {isFormOpen && (
            <CommunicationForm
              projectId={projectId}
              onCreated={async () => {
                await loadWorkspace();
                setIsFormOpen(false);
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          )}
          {!isFormOpen && communications.length === 0 && (
            <StatusMessage
              title="No communications yet."
              detail="Add the first raw project record to start building the communication history."
            />
          )}
          {communications.length > 0 && (
            <div className="communication-list">
              {communications.map((communication) => (
                <article className="communication-card" key={communication._id}>
                  <div className="communication-meta">
                    <span className="source-label">{communication.source}</span>
                    <time dateTime={communication.date}>
                      {new Date(communication.date).toLocaleDateString()}
                    </time>
                  </div>
                  <h3>{communication.sender}</h3>
                  <p>{communication.content}</p>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
