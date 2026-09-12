import { useMemo, useState } from "react";
import type { AnalysisRun, Communication, Insight, InsightType } from "../types";
import { SourceCommunication } from "./SourceCommunication";
import { StatusMessage } from "./StatusMessage";

interface ProjectTruthProps {
  insights: Insight[];
  communications: Communication[];
  latestRun?: AnalysisRun;
  isRunning: boolean;
  runError?: string;
  onRunAnalysis: () => void;
}

const CATEGORY_LABELS: Record<InsightType, string> = {
  decision: "Decisions",
  task: "Tasks",
  change: "Changes",
  risk: "Risks",
  conflict: "Conflicts",
};

function formatStatus(status: string): string {
  return status.replace("_", " ");
}

function formatDate(date?: string): string | undefined {
  return date ? new Date(date).toLocaleDateString() : undefined;
}

export function ProjectTruth({
  insights,
  communications,
  latestRun,
  isRunning,
  runError,
  onRunAnalysis,
}: ProjectTruthProps) {
  const [selectedCommunication, setSelectedCommunication] = useState<Communication>();
  const communicationsById = useMemo(
    () => new Map(communications.map((communication) => [communication._id, communication])),
    [communications]
  );

  const isLatestRunActive =
    latestRun?.status === "pending" || latestRun?.status === "processing";
  const latestInsights = latestRun
    ? insights.filter((insight) => insight.analysisRunId === latestRun._id)
    : [];

  return (
    <section className="truth-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Project Truth</p>
          <h2>Structured project understanding</h2>
          <p className="section-intro">
            Important decisions, work, changes, risks, and conflicts extracted from project communication.
          </p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={onRunAnalysis}
          disabled={isRunning || isLatestRunActive}
        >
          {isRunning || isLatestRunActive ? "Analyzing project communication..." : "Run Analysis"}
        </button>
      </div>
      {runError && <StatusMessage title="Could not start analysis." detail={runError} tone="error" />}
      {latestRun && (
        <div className="latest-run">
          <strong>Latest analysis</strong>
          <span>{new Date(latestRun.startedAt).toLocaleString()}</span>
          <span className={`run-status run-status--${latestRun.status}`}>
            {formatStatus(latestRun.status)}
          </span>
        </div>
      )}
      {!latestRun ? (
        <StatusMessage
          title="No analysis yet."
          detail="Project communications have not been analyzed yet, so there is no structured project truth to show."
        />
      ) : isLatestRunActive ? (
        <StatusMessage
          title="ProjectLens is analyzing the communication history."
          detail="This view will show decisions, tasks, changes, risks, and conflicts when the analysis is complete."
        />
      ) : latestRun.status === "failed" ? (
        <StatusMessage
          title="ProjectLens could not analyze these communications."
          detail="Try running a new analysis. Previous analysis results remain available."
          tone="error"
        />
      ) : latestInsights.length === 0 ? (
        <StatusMessage
          title="No insights were found."
          detail="The completed analysis did not identify any structured decisions, tasks, changes, risks, or conflicts."
        />
      ) : (
        <div className="truth-grid">
          {(Object.keys(CATEGORY_LABELS) as InsightType[]).map((type) => {
            const categoryInsights = latestInsights.filter((insight) => insight.type === type);
            if (categoryInsights.length === 0) return null;
            return (
              <section className="truth-category" key={type}>
                <div className="category-heading">
                  <h3>{CATEGORY_LABELS[type]}</h3>
                  <span>{categoryInsights.length}</span>
                </div>
                <div className="insight-list">
                  {categoryInsights.map((insight) => (
                    <article className="insight-card" key={insight._id}>
                      <div className="insight-card-heading">
                        <h4>{insight.title}</h4>
                        <span className={`insight-status insight-status--${insight.status}`}>
                          {formatStatus(insight.status)}
                        </span>
                      </div>
                      <p>{insight.description}</p>
                      {insight.rationale && (
                        <p className="insight-detail"><strong>Rationale:</strong> {insight.rationale}</p>
                      )}
                      {insight.assignee && (
                        <p className="insight-detail"><strong>Assignee:</strong> {insight.assignee}</p>
                      )}
                      {insight.dueDate && (
                        <p className="insight-detail"><strong>Due:</strong> {formatDate(insight.dueDate)}</p>
                      )}
                      {insight.severity && (
                        <p className="insight-detail"><strong>Severity:</strong> {insight.severity}</p>
                      )}
                      {insight.dependsOnInsightIds && insight.dependsOnInsightIds.length > 0 && (
                        <p className="insight-detail">
                          <strong>Dependencies:</strong> {insight.dependsOnInsightIds.length}
                        </p>
                      )}
                      <div className="insight-source">
                        <span>
                          <strong>Source:</strong>{" "}
                          {insight.sourceCommunicationIds.length} communication
                          {insight.sourceCommunicationIds.length === 1 ? "" : "s"}
                        </span>
                        <div className="source-links">
                          {insight.sourceCommunicationIds.map((communicationId) => {
                            const communication = communicationsById.get(communicationId);
                            return communication ? (
                              <button
                                className="source-link"
                                type="button"
                                key={communicationId}
                                onClick={() => setSelectedCommunication(communication)}
                              >
                                View source
                              </button>
                            ) : (
                              <span className="source-unavailable" key={communicationId}>
                                Source unavailable
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
      {selectedCommunication && (
        <SourceCommunication
          communication={selectedCommunication}
          onClose={() => setSelectedCommunication(undefined)}
        />
      )}
    </section>
  );
}
