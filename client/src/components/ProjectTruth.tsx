import { useMemo, useState } from "react";
import type { AnalysisRun, Communication, Insight, InsightType } from "../types";
import { SourceCommunication } from "./SourceCommunication";
import { StatusMessage } from "./StatusMessage";

interface ProjectTruthProps {
  insights: Insight[];
  communications: Communication[];
  latestRun?: AnalysisRun;
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
}: ProjectTruthProps) {
  const [selectedCommunication, setSelectedCommunication] = useState<Communication>();
  const communicationsById = useMemo(
    () => new Map(communications.map((communication) => [communication._id, communication])),
    [communications]
  );

  if (!latestRun) {
    return (
      <section className="truth-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project Truth</p>
            <h2>Structured project understanding</h2>
          </div>
        </div>
        <StatusMessage
          title="No analysis yet."
          detail="Project communications have not been analyzed yet, so there is no structured project truth to show."
        />
      </section>
    );
  }

  if (latestRun.status === "pending" || latestRun.status === "processing") {
    return (
      <section className="truth-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project Truth</p>
            <h2>Analysis in progress</h2>
          </div>
          <span className="run-status run-status--processing">{formatStatus(latestRun.status)}</span>
        </div>
        <StatusMessage
          title="ProjectLens is analyzing the communication history."
          detail="This view will show decisions, tasks, changes, risks, and conflicts when the analysis is complete."
        />
      </section>
    );
  }

  if (latestRun.status === "failed") {
    return (
      <section className="truth-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project Truth</p>
            <h2>Analysis could not be completed</h2>
          </div>
          <span className="run-status run-status--failed">Failed</span>
        </div>
        <StatusMessage
          title="ProjectLens could not analyze these communications."
          detail={latestRun.errorMessage || "Try again after checking the project communication records."}
          tone="error"
        />
      </section>
    );
  }

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
        <span className="run-status run-status--completed">Analysis complete</span>
      </div>
      {insights.length === 0 ? (
        <StatusMessage
          title="No insights were found."
          detail="The completed analysis did not identify any structured decisions, tasks, changes, risks, or conflicts."
        />
      ) : (
        <div className="truth-grid">
          {(Object.keys(CATEGORY_LABELS) as InsightType[]).map((type) => {
            const categoryInsights = insights.filter((insight) => insight.type === type);
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
