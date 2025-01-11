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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  maintenance_date: z.string().min(1, "Inspection date is required"),
  description: z.string().min(1, "Inspection notes are required"),
  cost: z.number().optional(),
  performed_by: z.string().min(1, "Inspector name is required"),
  next_maintenance_date: z.string().min(1, "Next inspection date is required"),
  checklist_completed: z.boolean().default(false),
  checklist_notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function InspectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maintenance_date: new Date().toISOString().split("T")[0],
      description: "",
      cost: 0,
      performed_by: "",
      next_maintenance_date: "",
      checklist_completed: false,
      checklist_notes: "",
    },
  });

  const { data: asset } = useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const onSubmit = async (values: FormValues) => {
    if (!id) {
      toast({
        title: "Error",
        description: "Asset ID is missing",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("maintenance_records").insert({
      asset_id: id,
      maintenance_date: values.maintenance_date,
      description: values.description,
      cost: values.cost || 0,
      performed_by: values.performed_by,
      next_maintenance_date: values.next_maintenance_date,
    });

    if (error) {
      console.error("Error saving inspection:", error);
      toast({
        title: "Error",
        description: "Failed to save inspection: " + error.message,
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
                  <Input type="date" {...field} />
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
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
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