import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api";
import { useAuth } from "../auth";

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (!name.trim() || !email.trim() || !password || !confirmation) {
      setError("Name, email, password, and confirmation are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      navigate("/projects", { replace: true });
    } catch (reason: unknown) {
      setError(reason instanceof ApiError && reason.status === 409
        ? "An account with this email already exists."
        : reason instanceof ApiError && reason.status === 400
          ? reason.message
          : "Unable to create your account right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Get started</p>
        <h1>Create your account</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>Name<input value={name} onChange={(event) => setName(event.target.value)} disabled={isSubmitting} /></label>
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={isSubmitting} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={isSubmitting} /></label>
        <label>Confirm password<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={isSubmitting} /></label>
        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
