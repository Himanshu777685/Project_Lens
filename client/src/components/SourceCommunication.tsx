import type { Communication } from "../types";

interface SourceCommunicationProps {
  communication: Communication;
  onClose: () => void;
}

function formatSource(source: Communication["source"]): string {
  return source.replace("_", " ");
}

export function SourceCommunication({
  communication,
  onClose,
}: SourceCommunicationProps) {
  return (
    <div className="source-dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="source-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="source-dialog-heading">
          <div>
            <p className="eyebrow">Source communication</p>
            <h2 id="source-dialog-title">Original project record</h2>
          </div>
          <button className="text-button" type="button" onClick={onClose} aria-label="Close source">
            Close
          </button>
        </div>
        <div className="source-dialog-meta">
          <span className="source-label">{formatSource(communication.source)}</span>
          <strong>{communication.sender}</strong>
          <time dateTime={communication.date}>
            {new Date(communication.date).toLocaleString()}
          </time>
        </div>
        <p className="source-dialog-content">{communication.content}</p>
      </section>
    </div>
  );
}
