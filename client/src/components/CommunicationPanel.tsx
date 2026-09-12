import { useEffect, useRef } from "react";
import type { Communication } from "../types";

interface CommunicationPanelProps {
  communications: Communication[];
  highlightedIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

function formatSource(source: Communication["source"]): string {
  return source.replace("_", " ");
}

export function CommunicationPanel({
  communications,
  highlightedIds,
  isOpen,
  onClose,
}: CommunicationPanelProps) {
  const cardRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const firstHighlighted = highlightedIds[0];
    if (!firstHighlighted) return;
    cardRefs.current.get(firstHighlighted)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [highlightedIds]);

  return (
    <aside className={`communications-panel${isOpen ? " communications-panel--open" : ""}`}>
      <div className="communications-panel-heading">
        <div>
          <p className="eyebrow">Communications</p>
          <h2>Project evidence</h2>
          <p>Incoming updates and original project records.</p>
        </div>
        <button className="text-button communications-close" type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="communication-list communications-panel-list">
        {communications.map((communication) => {
          const isHighlighted = highlightedIds.includes(communication._id);
          return (
            <article
              className={`communication-card${isHighlighted ? " communication-card--highlighted" : ""}`}
              key={communication._id}
              ref={(element) => {
                if (element) cardRefs.current.set(communication._id, element);
                else cardRefs.current.delete(communication._id);
              }}
            >
              <div className="communication-meta">
                <span className="source-label">{formatSource(communication.source)}</span>
                <time dateTime={communication.date}>
                  {new Date(communication.date).toLocaleString()}
                </time>
              </div>
              <h3>{communication.sender}</h3>
              <p>{communication.content}</p>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
