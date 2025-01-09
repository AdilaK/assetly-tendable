import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export function InspectionList() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: inspections, refetch } = useQuery({
    queryKey: ["inspections", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_records")
        .select(`
          *,
          assets (
            name,
            serial_number
          )
        `)
        .ilike("description", `%${searchTerm}%`);

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("maintenance_records")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete inspection record",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Inspection record deleted successfully",
      });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inspections</h2>
        {assets && assets.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Inspection
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {assets.map((asset) => (
                <DropdownMenuItem
                  key={asset.id}
                  onClick={() => navigate(`/assets/${asset.id}/inspect`)}
                >
                  {asset.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search inspections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Next Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections?.map((inspection) => (
              <TableRow key={inspection.id}>
                <TableCell>
                  {inspection.assets?.name}{" "}
                  {inspection.assets?.serial_number && (
                    <span className="text-sm text-muted-foreground">
                      ({inspection.assets.serial_number})
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(inspection.maintenance_date), "PP")}
                </TableCell>
                <TableCell>{inspection.description}</TableCell>
                <TableCell>{inspection.performed_by}</TableCell>
                <TableCell>
                  {inspection.next_maintenance_date &&
                    format(new Date(inspection.next_maintenance_date), "PP")}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      navigate(`/assets/${inspection.asset_id}/inspect`)
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(inspection.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}