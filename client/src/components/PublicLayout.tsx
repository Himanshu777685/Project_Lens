import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";

export function PublicLayout() {
  return (
    <div className="public-shell">
      <PublicNavbar />
      <Outlet />
    </div>
  );
}
