import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../api";
import { useAuth } from "../auth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate(destination?.startsWith("/projects") ? destination : "/projects", { replace: true });
    } catch (reason: unknown) {
      setError(reason instanceof ApiError && reason.status === 401
        ? "Invalid email or password."
        : "Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to ProjectLens</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={isSubmitting} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={isSubmitting} /></label>
        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Log in"}</button>
        <p className="auth-switch">Need an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </main>
  );
}
