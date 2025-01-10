import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package2, ClipboardList, FileText, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  return (
    <div className="flex-1 bg-[#221F26] p-6 flex flex-col h-full">
      <nav className="space-y-2 flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
              isActive ? "bg-gray-800 text-white" : ""
            }`
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/assets"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
              isActive ? "bg-gray-800 text-white" : ""
            }`
          }
        >
          <Package2 className="h-4 w-4" />
          <span>Assets</span>
        </NavLink>
        <NavLink
          to="/inspections"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
              isActive ? "bg-gray-800 text-white" : ""
            }`
          }
        >
          <ClipboardList className="h-4 w-4" />
          <span>Inspections</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
              isActive ? "bg-gray-800 text-white" : ""
            }`
          }
        >
          <FileText className="h-4 w-4" />
          <span>Reports</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
              isActive ? "bg-gray-800 text-white" : ""
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