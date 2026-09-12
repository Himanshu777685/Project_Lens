import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects, updateProjectStatus } from "../api";
import { ProjectForm } from "../components/ProjectForm";
import { StatusMessage } from "../components/StatusMessage";
import type { Project } from "../types";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | Project["status"]>("all");
  const [updatingProjectId, setUpdatingProjectId] = useState<string>();
  const [confirmingProjectId, setConfirmingProjectId] = useState<string>();

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

  async function handleStatusChange(project: Project) {
    const nextStatus = project.status === "active" ? "archived" : "active";
    setUpdatingProjectId(project._id);
    setError(undefined);
    try {
      const updatedProject = await updateProjectStatus(project._id, nextStatus);
      setProjects((current) =>
        current.map((item) => (item._id === updatedProject._id ? updatedProject : item))
      );
      setConfirmingProjectId(undefined);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to update project status.");
    } finally {
      setUpdatingProjectId(undefined);
    }
  }

  const visibleProjects = filter === "all"
    ? projects
    : projects.filter((project) => project.status === filter);

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
        <>
          <div className="project-filter" aria-label="Filter projects">
            {(["all", "active", "archived"] as const).map((value) => (
              <button
                className={filter === value ? "filter-button filter-button--selected" : "filter-button"}
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
              >
                {value === "all" ? "All" : value}
              </button>
            ))}
          </div>
          {visibleProjects.length === 0 ? (
            <StatusMessage title={`No ${filter} projects.`} />
          ) : (
            <div className="project-list">
              {visibleProjects.map((project) => {
                const isUpdating = updatingProjectId === project._id;
                const isConfirming = confirmingProjectId === project._id;
                return (
                  <div className="project-row" key={project._id}>
                    <Link className="project-row-link" to={`/projects/${project._id}`}>
                      <span>
                        <strong>{project.name}</strong>
                        <small>{project.description || "No description provided."}</small>
                      </span>
                      <span className={`project-status project-status--${project.status}`}>{project.status}</span>
                    </Link>
                    <div className="project-actions">
                      {isConfirming && project.status === "active" && (
                        <span className="archive-confirmation" role="alert">
                          Archive this project? Its history will remain available.
                        </span>
                      )}
                      {isConfirming && project.status === "active" && (
                        <>
                          <button className="text-button" type="button" onClick={() => setConfirmingProjectId(undefined)} disabled={isUpdating}>
                            Cancel
                          </button>
                          <button className="text-button" type="button" onClick={() => void handleStatusChange(project)} disabled={isUpdating}>
                            {isUpdating ? "Archiving..." : "Archive project"}
                          </button>
                        </>
                      )}
                      {!isConfirming && (
                        <button
                          className="text-button"
                          type="button"
                          onClick={() => project.status === "active"
                            ? setConfirmingProjectId(project._id)
                            : void handleStatusChange(project)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : project.status === "active" ? "Archive" : "Restore"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
