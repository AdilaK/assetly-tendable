import { useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CategorySelect } from "./forms/CategorySelect";
import { LocationSelect } from "./forms/LocationSelect";
import { StatusSelect } from "./forms/StatusSelect";
import { WarrantyFields } from "./forms/WarrantyFields";

type FormValues = {
  name: string;
  description: string;
  serial_number: string;
  category_id: string;
  location_id: string;
  status: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_end_date: string;
  warranty_details: string;
};

export function AssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<FormValues>();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to manage assets",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const { data: asset, isLoading: assetLoading } = useQuery({
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

  useEffect(() => {
    if (asset) {
      form.reset(asset);
    }
  }, [asset, form]);

  const onSubmit = async (values: FormValues) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage assets",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const operation = id
      ? supabase.from("assets").update(values).eq("id", id)
      : supabase.from("assets").insert(values);

    const { error } = await operation;

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save asset",
        variant: "destructive",
      });
      console.error("Error saving asset:", error);
    } else {
      toast({
        title: "Success",
        description: "Asset saved successfully",
      });
      navigate("/assets");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {id ? "Edit Asset" : "New Asset"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CategorySelect form={form} />
          <LocationSelect form={form} />
          <StatusSelect form={form} />

          <FormField
            control={form.control}
            name="purchase_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <WarrantyFields form={form} />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/assets")}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}