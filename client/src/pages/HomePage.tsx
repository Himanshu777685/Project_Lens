import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Project intelligence</p>
        <h1>Keep every project decision in view.</h1>
        <p className="lede">
          ProjectLens brings your project communications and insights together in one
          secure workspace.
        </p>
        <div className="auth-actions">
          <Link className="primary-button" to="/signup">Create an account</Link>
          <Link className="secondary-button" to="/login">Log in</Link>
        </div>
      </section>
    </main>
  );
}
