import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ComboboxSelect } from "./ComboboxSelect";

interface LocationSelectProps {
  form: UseFormReturn<any>;
}

export function LocationSelect({ form }: LocationSelectProps) {
  const { toast } = useToast();

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");
      if (error) {
        toast({
          title: "Error loading locations",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    },
  });

  const createLocation = async (name: string) => {
    if (!name.trim()) return;
    
    // Check if location already exists
    const existingLocation = locations.find(
      (loc) => loc.name.toLowerCase() === name.toLowerCase()
    );
    if (existingLocation) {
      form.setValue("location_id", existingLocation.id);
      return;
    }

    const { data, error } = await supabase
      .from("locations")
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create location",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Location created successfully",
    });

    form.setValue("location_id", data.id);
  };

  return (
    <ComboboxSelect
      form={form}
      name="location_id"
      label="Location"
      items={locations}
      isLoading={isLoading}
      onCreateNew={createLocation}
    />
  );
}