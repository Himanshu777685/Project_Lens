import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProject,
  createAnalysisRun,
  executeAnalysisRun,
  listProjectAnalysisRuns,
  listProjectCommunications,
  listProjectInsights,
} from "../api";
import { CommunicationForm } from "../components/CommunicationForm";
import { CommunicationPanel } from "../components/CommunicationPanel";
import { ProjectTruth } from "../components/ProjectTruth";
import { StatusMessage } from "../components/StatusMessage";
import type { AnalysisRun, Communication, Insight, Project } from "../types";

export function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project>();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [analysisRuns, setAnalysisRuns] = useState<AnalysisRun[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [analysisActionError, setAnalysisActionError] = useState<string>();
  const [highlightedCommunicationIds, setHighlightedCommunicationIds] = useState<string[]>([]);
  const [isCommunicationsOpen, setIsCommunicationsOpen] = useState(false);

  const loadWorkspace = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(undefined);
    try {
      const [projectData, communicationData, analysisRunData, insightData] = await Promise.all([
        getProject(projectId),
        listProjectCommunications(projectId),
        listProjectAnalysisRuns(projectId),
        listProjectInsights(projectId),
      ]);
      setProject(projectData);
      setCommunications(communicationData);
      setAnalysisRuns(analysisRunData);
      setInsights(insightData);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to load project workspace.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const latestRun = analysisRuns[0];

  const runAnalysis = useCallback(async () => {
    if (!projectId) return;
    if (communications.length === 0) {
      setAnalysisActionError("Add project communications before running an analysis.");
      return;
    }

    setIsRunningAnalysis(true);
    setAnalysisActionError(undefined);
    try {
      let run;
      try {
        run = await createAnalysisRun(
          projectId,
          communications.map((communication) => communication._id)
        );
      } catch {
        setAnalysisActionError("Could not start analysis.");
        return;
      }

      try {
        await executeAnalysisRun(run._id);
      } catch {
        setAnalysisActionError("Analysis failed. Please try again.");
        return;
      }

      await loadWorkspace();
    } catch {
      setAnalysisActionError(
        "Analysis completed, but the latest Project Truth could not be refreshed. Please retry."
      );
    } finally {
      setIsRunningAnalysis(false);
    }
  }, [communications, loadWorkspace, projectId]);

  useEffect(() => {
    if (!latestRun || (latestRun.status !== "pending" && latestRun.status !== "processing")) {
      return;
    }
    const intervalId = window.setInterval(() => {
      void loadWorkspace();
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [latestRun, loadWorkspace]);

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
          <button
            className="secondary-button communications-toggle"
            type="button"
            onClick={() => setIsCommunicationsOpen(true)}
          >
            View communications
          </button>
          <div className="workspace-grid">
            <CommunicationPanel
              communications={communications}
              highlightedIds={highlightedCommunicationIds}
              isOpen={isCommunicationsOpen}
              onClose={() => setIsCommunicationsOpen(false)}
            />
            <ProjectTruth
              insights={insights}
              communications={communications}
              analysisRuns={analysisRuns}
              latestRun={latestRun}
              isRunning={isRunningAnalysis}
              runError={analysisActionError}
              onRunAnalysis={() => void runAnalysis()}
              onViewSources={(communicationIds) => {
                setHighlightedCommunicationIds(communicationIds);
                setIsCommunicationsOpen(true);
              }}
            />
          </div>
          {communications.length === 0 && (
            <StatusMessage
              title="No communications yet."
              detail="Add the first raw project record to start building the communication history."
            />
          )}
        </>
      )}
    </section>
  );
}
