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

interface CategorySelectProps {
  form: UseFormReturn<any>;
}

export function CategorySelect({ form }: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: categories = [], isLoading, error, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createCategory = async () => {
    if (!searchTerm.trim()) return;

    // Check if category already exists
    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === searchTerm.toLowerCase()
    );
    if (exists) {
      toast({
        title: "Category already exists",
        description: "Please select from existing categories or use a different name",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: searchTerm.trim() })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      form.setValue("category_id", data.id);
      setSearchTerm("");
      setOpen(false);
      refetch();
    }
  };

  if (error) {
    return (
      <FormItem>
        <FormLabel>Category</FormLabel>
        <div className="text-sm text-destructive">Failed to load categories</div>
      </FormItem>
    );
  }

  return (
    <FormField
      control={form.control}
      name="category_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Category</FormLabel>
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
                    categories?.find((category) => category.id === field.value)
                      ?.name || "Select category"
                  ) : (
                    "Select category"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search category..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandEmpty>
                  <div className="p-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={createCategory}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{searchTerm}"
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredCategories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => {
                        form.setValue("category_id", category.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          category.id === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {category.name}
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