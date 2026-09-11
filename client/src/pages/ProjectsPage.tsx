import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects } from "../api";
import { ProjectForm } from "../components/ProjectForm";
import { StatusMessage } from "../components/StatusMessage";
import type { Project } from "../types";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  async function loadProjects() {
    setIsLoading(true);
    setError(undefined);
    try {
      setProjects(await listProjects());
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to load projects.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  return (
    <section className="page-section">
      <div className="page-heading page-heading--with-action">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Projects</h1>
          <p className="lede">Select a project to continue into its communication and intelligence workspace.</p>
        </div>
        {!isFormOpen && (
          <button className="primary-button" type="button" onClick={() => setIsFormOpen(true)}>
            New project
          </button>
        )}
      </div>

      {isFormOpen && (
        <ProjectForm
          onCreated={async () => {
            await loadProjects();
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
      {isLoading && <StatusMessage title="Loading projects..." />}
      {error && (
        <div>
          <StatusMessage title="Projects could not be loaded." detail={error} tone="error" />
          <button className="retry-button" type="button" onClick={() => void loadProjects()}>
            Retry
          </button>
        </div>
      )}
      {!isLoading && !error && projects.length === 0 && (
        <StatusMessage title="No projects yet." detail="Create a project through the backend API to make it available here." />
      )}
      {!isLoading && !error && projects.length > 0 && (
        <div className="project-list">
          {projects.map((project) => (
            <Link className="project-row" key={project._id} to={`/projects/${project._id}`}>
              <span>
                <strong>{project.name}</strong>
                <small>{project.description || "No description provided."}</small>
              </span>
              <span className={`project-status project-status--${project.status}`}>{project.status}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
