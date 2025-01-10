import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ComboboxSelect } from "./ComboboxSelect";

interface CategorySelectProps {
  form: UseFormReturn<any>;
}

export function CategorySelect({ form }: CategorySelectProps) {
  const { toast } = useToast();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) {
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    },
  });

  const createCategory = async (name: string) => {
    if (!name.trim()) return;
    
    // Check if category already exists
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );
    if (existingCategory) {
      form.setValue("category_id", existingCategory.id);
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Category created successfully",
    });

    form.setValue("category_id", data.id);
  };

  return (
    <ComboboxSelect
      form={form}
      name="category_id"
      label="Category"
      items={categories}
      isLoading={isLoading}
      onCreateNew={createCategory}
    />
  );
}