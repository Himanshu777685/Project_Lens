import { FormEvent, useState } from "react";
import { createCommunication } from "../api";
import type { CommunicationSource } from "../types";

export const COMMUNICATION_SOURCES: readonly CommunicationSource[] = [
  "whatsapp",
  "email",
  "meeting",
  "site",
  "supplier",
  "drawing",
  "voice_note",
  "other",
];

interface CommunicationFormProps {
  projectId: string;
  onCreated: () => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  source: CommunicationSource | "";
  sender: string;
  date: string;
  content: string;
}

const initialValues: FormValues = {
  source: "",
  sender: "",
  date: "",
  content: "",
};

export function CommunicationForm({
  projectId,
  onCreated,
  onCancel,
}: CommunicationFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (!values.source || !values.sender.trim() || !values.date || !values.content.trim()) {
      setError("Source, sender, date, and content are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommunication(projectId, {
        source: values.source,
        sender: values.sender.trim(),
        date: values.date,
        content: values.content.trim(),
      });
      setValues(initialValues);
      await onCreated();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to save communication.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="communication-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">New record</p>
          <h2>Add communication</h2>
        </div>
        <button className="text-button" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-grid">
        <label>
          Source
          <select
            value={values.source}
            onChange={(event) => updateValue("source", event.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Select source</option>
            {COMMUNICATION_SOURCES.map((source) => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </label>
        <label>
          Sender
          <input
            value={values.sender}
            onChange={(event) => updateValue("sender", event.target.value)}
            placeholder="Person or organization"
            disabled={isSubmitting}
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={values.date}
            onChange={(event) => updateValue("date", event.target.value)}
            disabled={isSubmitting}
          />
        </label>
      </div>
      <label>
        Content
        <textarea
          value={values.content}
          onChange={(event) => updateValue("content", event.target.value)}
          placeholder="Paste the original message, meeting notes, or transcript."
          rows={6}
          disabled={isSubmitting}
        />
      </label>
      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save communication"}
        </button>
      </div>
    </form>
  );
}
