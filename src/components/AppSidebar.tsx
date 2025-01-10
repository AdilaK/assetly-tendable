import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package2, ClipboardList, FileText, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function AppSidebar() {
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-64 border-r bg-muted/40 p-6 flex flex-col h-full">
      <nav className="space-y-2 flex-1">
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

      <Button
        variant="ghost"
        size="icon"
        className="self-start mt-auto"
        onClick={handleLogout}
        title="Sign Out"
      >
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Sign Out</span>
      </Button>
    </div>
  );
}