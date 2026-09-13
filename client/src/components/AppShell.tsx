import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";

export function AppShell() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

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
          <NavLink className="nav-link" to="/projects">
            Projects
          </NavLink>
          <span className="nav-user">{user?.name}</span>
          <button className="text-button" type="button" onClick={() => void handleLogout()}>
            Log out
          </button>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
