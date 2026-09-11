import { NavLink, Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/">
          <span className="brand-mark">PL</span>
          <span>
            <strong>ProjectLens</strong>
            <small>Project intelligence</small>
          </span>
        </NavLink>
        <nav aria-label="Primary navigation">
          <NavLink className="nav-link" to="/">
            Projects
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
