import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#221F26]">
      <div className="w-64 min-h-screen flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-white">Asset</span>
              <span className="text-[#0EA5E9]">Flow</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Intelligent equipment monitoring
            </p>
          </div>
        </div>
        <AppSidebar />
      </div>
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        <Outlet />
      </main>
    </div>
  );
}