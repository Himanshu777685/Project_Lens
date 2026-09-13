import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../api";
import { useAuth } from "../auth";

interface AuthPageProps {
  mode: "login" | "signup";
}

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (isSignup && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (isSignup && password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignup) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      const state = location.state as { from?: { pathname?: string } } | null;
      const destination = state?.from?.pathname;
      navigate(destination?.startsWith("/projects") ? destination : "/projects", { replace: true });
    } catch (reason: unknown) {
      setError(reason instanceof ApiError && reason.status === 401
        ? "Invalid email or password."
        : reason instanceof Error ? reason.message : "We could not complete that request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration--top" />
      <div className="auth-panel">
        <Link className="auth-logo" to="/"><span className="brand-mark">PL</span><strong>ProjectLens</strong></Link>
        <div className="auth-heading">
          <p className="eyebrow">{isSignup ? "Start with clarity" : "Welcome back"}</p>
          <h1>{isSignup ? "Create your workspace." : "Sign in to your workspace."}</h1>
          <p>{isSignup ? "Bring your project conversations into focus." : "Pick up where your project left off."}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="form-error" role="alert">{error}</p>}
          {isSignup && <label>Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" disabled={isSubmitting} /></label>}
          <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" disabled={isSubmitting} /></label>
          <label>Password<input type="password" autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? "At least 8 characters" : "Your password"} disabled={isSubmitting} /></label>
          <button className="primary-button primary-button--full" type="submit" disabled={isSubmitting}>{isSubmitting ? (isSignup ? "Creating workspace..." : "Signing in...") : (isSignup ? "Create workspace" : "Sign in")} <span>→</span></button>
        </form>
        <p className="auth-switch">{isSignup ? "Already have an account?" : "New to ProjectLens?"} <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link></p>
        <Link className="auth-back-link" to="/">← Back to ProjectLens</Link>
      </div>
      <aside className="auth-aside"><p className="eyebrow">The clear view</p><blockquote>“The fastest way to get aligned is to make the project story visible to everyone.”</blockquote><div className="auth-aside-card"><span>✦</span><div><strong>Project truth</strong><small>Decisions, tasks, and risks — in one place.</small></div></div></aside>
    </main>
  );
}
