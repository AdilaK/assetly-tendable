import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package2, ClipboardList, FileText, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/auth"); // Changed from "/" to "/auth"
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
      });
    }
  };

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
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}