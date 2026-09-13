import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function AuthLoading() {
  return (
    <div className="auth-loading" role="status" aria-live="polite">
      <span className="loading-spinner" />
      <p>Restoring your workspace...</p>
    </div>
  );
}

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoading />;
  if (!user) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <AuthLoading />;
  if (user) return <Navigate replace to="/projects" />;
  return <Outlet />;
}
