import { Link } from "react-router-dom";
import { useAuth } from "../auth";

export function PublicNavbar() {
  const { user } = useAuth();

  return (
    <header className="public-navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">PL</span>
        <span className="brand-wordmark">
          <strong>ProjectLens</strong>
          <small>Project intelligence</small>
        </span>
      </Link>
      <nav className="public-nav-links" aria-label="Public navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#capabilities">Capabilities</a>
        {!user && <Link className="nav-login-link" to="/login">Sign in</Link>}
        <Link className="primary-button nav-cta" to={user ? "/projects" : "/signup"}>
          {user ? "Open workspace" : "Get started"}
        </Link>
      </nav>
    </header>
  );
}
