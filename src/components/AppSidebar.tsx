import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package2, ClipboardList, FileText, Settings } from "lucide-react";

export function AppSidebar() {
  return (
    <div className="w-64 border-r bg-muted/40 p-6">
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-muted ${
              isActive ? "bg-muted" : ""
            }`
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/assets"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-muted ${
              isActive ? "bg-muted" : ""
            }`
          }
        >
          <Package2 className="h-4 w-4" />
          <span>Assets</span>
        </NavLink>
        <NavLink
          to="/inspections"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-muted ${
              isActive ? "bg-muted" : ""
            }`
          }
        >
          <ClipboardList className="h-4 w-4" />
          <span>Inspections</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-muted ${
              isActive ? "bg-muted" : ""
            }`
          }
        >
          <FileText className="h-4 w-4" />
          <span>Reports</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-muted ${
              isActive ? "bg-muted" : ""
            }`
          }
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}