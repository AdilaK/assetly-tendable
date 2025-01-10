import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface WarrantyFieldsProps {
  form: UseFormReturn<any>;
}

export function WarrantyFields({ form }: WarrantyFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="warranty_start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Warranty Start Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="warranty_end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Warranty End Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="warranty_details"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Warranty Details</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}