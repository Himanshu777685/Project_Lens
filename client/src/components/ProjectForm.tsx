import { FormEvent, useState } from "react";
import { createProject } from "../api";

interface ProjectFormProps {
  onCreated: () => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({ onCreated, onCancel }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject({
        name: name.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
      });
      setName("");
      setDescription("");
      await onCreated();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to create project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">New workspace</p>
          <h2>Create project</h2>
        </div>
        <button className="text-button" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <label>
        Project name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Residential Tower"
          disabled={isSubmitting}
        />
      </label>
      <label>
        Description <span className="optional-label">(optional)</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="A short description of the project"
          rows={3}
          disabled={isSubmitting}
        />
      </label>
      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create project"}
        </button>
      </div>
    </form>
  );
}
