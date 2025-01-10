import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";

interface LocationSelectProps {
  form: UseFormReturn<any>;
}

export function LocationSelect({ form }: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const { toast } = useToast();

  const { data: locations = [], isLoading, error, refetch } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const createLocation = async () => {
    if (!newLocation.trim()) return;

    const { data, error } = await supabase
      .from("locations")
      .insert({ name: newLocation.trim() })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create location",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Location created successfully",
      });
      form.setValue("location_id", data.id);
      setNewLocation("");
      setOpen(false);
      refetch();
    }
  };

  if (error) {
    return (
      <FormItem>
        <FormLabel>Location</FormLabel>
        <div className="text-sm text-destructive">Failed to load locations</div>
      </FormItem>
    );
  }

  return (
    <FormField
      control={form.control}
      name="location_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Location</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={isLoading}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : field.value ? (
                    locations?.find((location) => location.id === field.value)
                      ?.name || "Select location"
                  ) : (
                    "Select location"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search location..."
                  value={newLocation}
                  onValueChange={setNewLocation}
                />
                <CommandEmpty>
                  <div className="p-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={createLocation}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{newLocation}"
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {locations.map((location) => (
                    <CommandItem
                      value={location.name}
                      key={location.id}
                      onSelect={() => {
                        form.setValue("location_id", location.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          location.id === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {location.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}