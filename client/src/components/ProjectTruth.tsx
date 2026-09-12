import { useMemo, useState } from "react";
import type { AnalysisRun, Communication, Insight, InsightType } from "../types";
import { StatusMessage } from "./StatusMessage";

interface ProjectTruthProps {
  insights: Insight[];
  communications: Communication[];
  analysisRuns: AnalysisRun[];
  latestRun?: AnalysisRun;
  isRunning: boolean;
  runError?: string;
  onRunAnalysis: () => void;
  onViewSources: (communicationIds: string[]) => void;
  onUpdateStatus: (insight: Insight, status: string) => Promise<void>;
}

const CATEGORY_LABELS: Record<InsightType, string> = {
  decision: "Decisions",
  task: "Tasks",
  change: "Changes",
  risk: "Risks",
  conflict: "Conflicts",
};

const STATUS_OPTIONS: Record<InsightType, string[]> = {
  decision: ["proposed", "confirmed", "rejected"],
  task: ["open", "in_progress", "completed"],
  change: ["recorded"],
  risk: ["open", "mitigated"],
  conflict: ["open", "resolved"],
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
  analysisRuns,
  latestRun,
  isRunning,
  runError,
  onRunAnalysis,
  onViewSources,
  onUpdateStatus,
}: ProjectTruthProps) {
  const [filter, setFilter] = useState<InsightType | "all">("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedInsight, setSelectedInsight] = useState<Insight>();
  const [updatingInsightId, setUpdatingInsightId] = useState<string>();
  const [updateError, setUpdateError] = useState<string>();
  const communicationsById = useMemo(
    () => new Map(communications.map((communication) => [communication._id, communication])),
    [communications]
  );

  const isLatestRunActive =
    latestRun?.status === "pending" || latestRun?.status === "processing";
  const latestInsights = latestRun
    ? insights.filter((insight) => insight.analysisRunId === latestRun._id)
    : [];
  const availableStatuses = filter === "all"
    ? Array.from(new Set(latestInsights.map((insight) => insight.status)))
    : STATUS_OPTIONS[filter];
  const visibleInsights = latestInsights.filter((insight) => {
    const searchText = `${insight.title} ${insight.description} ${insight.rationale || ""}`.toLowerCase();
    return (
      (filter === "all" || insight.type === filter) &&
      (statusFilter === "all" || insight.status === statusFilter) &&
      searchText.includes(search.trim().toLowerCase())
    );
  });

  const counts = (Object.keys(CATEGORY_LABELS) as InsightType[]).map((type) => ({
    type,
    count: latestInsights.filter((insight) => insight.type === type).length,
  }));

  async function changeStatus(insight: Insight, status: string) {
    setUpdatingInsightId(insight._id);
    setUpdateError(undefined);
    try {
      await onUpdateStatus(insight, status);
      setSelectedInsight((current) =>
        current?._id === insight._id ? { ...current, status } : current
      );
    } catch {
      setUpdateError("Could not update insight status. Please try again.");
    } finally {
      setUpdatingInsightId(undefined);
    }
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
        <button className="primary-button" type="button" onClick={onRunAnalysis} disabled={isRunning || isLatestRunActive}>
          {isRunning || isLatestRunActive ? "Analysis running..." : latestRun?.status === "failed" ? "Retry Analysis" : "Run Analysis"}
        </button>
      </div>
      {runError && <StatusMessage title="Analysis could not be completed." detail={runError} tone="error" />}
      {updateError && <StatusMessage title="Insight update failed." detail={updateError} tone="error" />}
      {latestRun && (
        <div className="latest-run">
          <strong>Latest analysis</strong>
          <span>{new Date(latestRun.startedAt).toLocaleString()}</span>
          <span className={`run-status run-status--${latestRun.status}`}>{formatStatus(latestRun.status)}</span>
        </div>
      )}
      {analysisRuns.length > 1 && (
        <details className="analysis-history">
          <summary>Analysis history ({analysisRuns.length})</summary>
          <div className="analysis-history-list">
            {analysisRuns.map((run) => {
              const count = insights.filter((insight) => insight.analysisRunId === run._id).length;
              return (
                <div className="analysis-history-row" key={run._id}>
                  <span className={`history-dot history-dot--${run.status}`} aria-hidden="true" />
                  <span>{formatStatus(run.status)}</span>
                  <time dateTime={run.startedAt}>{new Date(run.startedAt).toLocaleString()}</time>
                  <span>{count} insight{count === 1 ? "" : "s"}</span>
                </div>
              );
            })}
          </div>
        </details>
      )}
      {!latestRun ? (
        <StatusMessage title="No analysis yet." detail="Project communications have not been analyzed yet, so there is no structured project truth to show." />
      ) : isLatestRunActive ? (
        <StatusMessage title="ProjectLens is analyzing the communication history." detail="This view will show decisions, tasks, changes, risks, and conflicts when the analysis is complete." />
      ) : latestRun.status === "failed" ? (
        <StatusMessage title="Analysis failed." detail="Run a new analysis to try again. Previous analysis results remain available." tone="error" />
      ) : (
        <>
          <div className="truth-summary">
            <strong>{latestInsights.length} insight{latestInsights.length === 1 ? "" : "s"}</strong>
            {counts.map(({ type, count }) => (
              <button className="summary-count" type="button" key={type} onClick={() => { setFilter(type); setStatusFilter("all"); }}>
                {count} {CATEGORY_LABELS[type].toLowerCase()}
              </button>
            ))}
          </div>
          <div className="insight-controls">
            <input
              aria-label="Search insights"
              placeholder="Search insights..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="filter-tabs" role="group" aria-label="Insight type filter">
              <button className={filter === "all" ? "filter-tab filter-tab--active" : "filter-tab"} type="button" onClick={() => { setFilter("all"); setStatusFilter("all"); }}>All</button>
              {(Object.keys(CATEGORY_LABELS) as InsightType[]).map((type) => (
                <button className={filter === type ? "filter-tab filter-tab--active" : "filter-tab"} type="button" key={type} onClick={() => { setFilter(type); setStatusFilter("all"); }}>
                  {CATEGORY_LABELS[type]}
                </button>
              ))}
            </div>
            <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              {availableStatuses.map((status) => <option value={status} key={status}>{formatStatus(status)}</option>)}
            </select>
          </div>
          {visibleInsights.length === 0 ? (
            <StatusMessage title="No insights match your filters." detail={search ? `No insights match "${search}".` : "Try another category or status."} />
          ) : (
            <div className="truth-grid">
              {(Object.keys(CATEGORY_LABELS) as InsightType[]).map((type) => {
                const categoryInsights = visibleInsights.filter((insight) => insight.type === type);
                if (categoryInsights.length === 0) return null;
                return (
                  <section className="truth-category" key={type}>
                    <div className="category-heading"><h3>{CATEGORY_LABELS[type]}</h3><span>{categoryInsights.length}</span></div>
                    <div className="insight-list">
                      {categoryInsights.map((insight) => (
                        <article className="insight-card insight-card--interactive" key={insight._id} onClick={() => setSelectedInsight(insight)}>
                          <div className="insight-card-heading">
                            <h4>{insight.title}</h4>
                            <span className={`insight-status insight-status--${insight.status}`}>{formatStatus(insight.status)}</span>
                          </div>
                          <p>{insight.description}</p>
                          <div className="insight-source">
                            <span><strong>Source:</strong> {insight.sourceCommunicationIds.length} communication{insight.sourceCommunicationIds.length === 1 ? "" : "s"}</span>
                            <button className="source-link" type="button" onClick={(event) => { event.stopPropagation(); onViewSources(insight.sourceCommunicationIds); }}>View sources</button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}
      {selectedInsight && (
        <div className="source-dialog-backdrop" role="presentation" onClick={() => setSelectedInsight(undefined)}>
          <section className="source-dialog insight-detail-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="source-dialog-heading"><div><p className="eyebrow">{selectedInsight.type}</p><h2>{selectedInsight.title}</h2></div><button className="text-button" type="button" onClick={() => setSelectedInsight(undefined)}>Close</button></div>
            <div className="insight-detail-grid">
              <strong>Status</strong>
              <select value={selectedInsight.status} disabled={updatingInsightId === selectedInsight._id} onChange={(event) => void changeStatus(selectedInsight, event.target.value)}>
                {STATUS_OPTIONS[selectedInsight.type].map((status) => <option value={status} key={status}>{formatStatus(status)}</option>)}
              </select>
              {selectedInsight.severity && <><strong>Severity</strong><span>{selectedInsight.severity}</span></>}
              {selectedInsight.assignee && <><strong>Assignee</strong><span>{selectedInsight.assignee}</span></>}
              {selectedInsight.dueDate && <><strong>Due date</strong><span>{formatDate(selectedInsight.dueDate)}</span></>}
            </div>
            <h3>Description</h3><p className="source-dialog-content">{selectedInsight.description}</p>
            {selectedInsight.rationale && <><h3>Rationale</h3><p className="source-dialog-content">{selectedInsight.rationale}</p></>}
            {selectedInsight.dependsOnInsightIds && selectedInsight.dependsOnInsightIds.length > 0 && <p className="insight-detail"><strong>Dependencies:</strong> {selectedInsight.dependsOnInsightIds.length}</p>}
            <button
              className="source-link"
              type="button"
              onClick={() => {
                setSelectedInsight(undefined);
                onViewSources(selectedInsight.sourceCommunicationIds);
              }}
            >
              View sources
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
