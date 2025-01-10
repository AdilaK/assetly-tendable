import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LocationSelectProps {
  form: UseFormReturn<any>;
}

export function LocationSelect({ form }: LocationSelectProps) {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
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
    setOpen(false);
  };

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
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Loading..."
                    : field.value
                    ? locations.find((location) => location.id === field.value)
                        ?.name || "Select location"
                    : "Select location"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandEmpty className="p-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const searchTerm = document.querySelector<HTMLInputElement>(
                        '[cmdk-input=""]'
                      )?.value;
                      if (searchTerm) {
                        createLocation(searchTerm);
                      }
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create new location
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {locations.map((location) => (
                    <CommandItem
                      key={location.id}
                      value={location.name}
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