import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
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

interface Item {
  id: string;
  name: string;
}

interface ComboboxSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  items: Item[];
  isLoading: boolean;
  onCreateNew: (name: string) => void;
}

export function ComboboxSelect({
  form,
  name,
  label,
  items = [], // Provide default empty array
  isLoading,
  onCreateNew,
}: ComboboxSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateNew = () => {
    if (searchTerm.trim()) {
      onCreateNew(searchTerm.trim());
      setSearchTerm("");
      setOpen(false);
    }
  };

  // Get the selected item's name
  const selectedItem = items.find((item) => item.id === form.getValues(name));
  const displayValue = selectedItem?.name || `Select ${label.toLowerCase()}`;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
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
                  {isLoading ? "Loading..." : displayValue}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput 
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandEmpty>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleCreateNew}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create new {label.toLowerCase()}
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => {
                        form.setValue(name, item.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          item.id === field.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.name}
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