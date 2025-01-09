import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Box, CheckCircle, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [assets, maintenanceRecords] = await Promise.all([
        supabase.from("assets").select("*"),
        supabase.from("maintenance_records").select("*"),
      ]);

      if (assets.error || maintenanceRecords.error) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const today = new Date();
      const thisWeek = new Date(today);
      thisWeek.setDate(today.getDate() + 7);

      const upcomingInspections = maintenanceRecords.data.filter((record) => {
        const nextDate = new Date(record.next_maintenance_date);
        return nextDate <= thisWeek && nextDate >= today;
      });

      const totalInspections = maintenanceRecords.data.length;
      const completedInspections = maintenanceRecords.data.filter(
        (record) => new Date(record.maintenance_date) <= today
      ).length;

      return {
        totalAssets: assets.data.length,
        activeInspections: upcomingInspections.length,
        completionRate: totalInspections
          ? Math.round((completedInspections / totalInspections) * 100)
          : 0,
        alerts: assets.data.filter((asset) => asset.status === "maintenance")
          .length,
      };
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your asset management system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-slide-in" style={{ animationDelay: "0ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssets || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total managed assets in system
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Inspections
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeInspections || 0}
            </div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Inspection completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.alerts || 0}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}