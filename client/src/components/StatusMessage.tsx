interface StatusMessageProps {
  title: string;
  detail?: string;
  tone?: "muted" | "error";
}

export function StatusMessage({
  title,
  detail,
  tone = "muted",
}: StatusMessageProps) {
  return (
    <div className={`status-message status-message--${tone}`} role={tone === "error" ? "alert" : undefined}>
      <strong>{title}</strong>
      {detail && <p>{detail}</p>}
    </div>
  );
}
