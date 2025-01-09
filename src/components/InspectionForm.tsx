import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type FormValues = {
  maintenance_date: string;
  description: string;
  cost: number;
  performed_by: string;
  next_maintenance_date: string;
  checklist_completed: boolean;
  checklist_notes: string;
};

export function InspectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<FormValues>();

  const { data: asset } = useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    const { error } = await supabase.from("maintenance_records").insert({
      asset_id: id,
      maintenance_date: values.maintenance_date,
      description: values.description,
      cost: values.cost,
      performed_by: values.performed_by,
      next_maintenance_date: values.next_maintenance_date,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save inspection",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Inspection saved successfully",
      });
      navigate("/assets");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Inspect Asset: {asset?.name}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="maintenance_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspection Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspection Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="performed_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspector Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Cost (if applicable)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="next_maintenance_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Inspection Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checklist_completed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Standard Inspection Checklist Completed</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/assets")}
            >
              Cancel
            </Button>
            <Button type="submit">Save Inspection</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}