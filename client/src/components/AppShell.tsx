import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppShell() {
  const { user, logout } = useAuth();
  const displayName = user?.name || user?.email?.split("@")[0] || "Account";

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <NavLink className="brand" to="/projects">
          <span className="brand-mark">PL</span>
          <span className="brand-wordmark"><strong>ProjectLens</strong><small>Project intelligence</small></span>
        </NavLink>
        <div className="sidebar-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Workspace navigation">
          <NavLink className="sidebar-link" to="/projects" end><span className="sidebar-icon">▦</span>Projects</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-user"><span className="user-avatar">{displayName.charAt(0).toUpperCase()}</span><span><strong>{displayName}</strong><small>{user?.email}</small></span></div>
          <button className="sidebar-logout" type="button" onClick={() => void logout()}><span>↪</span> Sign out</button>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-mobile-header">
          <NavLink className="brand" to="/projects"><span className="brand-mark">PL</span><strong>ProjectLens</strong></NavLink>
          <button className="mobile-logout" type="button" onClick={() => void logout()} aria-label="Sign out">↪</button>
        </header>
        <main className="app-main"><Outlet /></main>
      </div>
    </div>
  );
}
