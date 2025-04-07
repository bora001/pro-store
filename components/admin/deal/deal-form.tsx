"use client";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createDeal, updateDeal } from "@/lib/actions/admin.actions";
import { PATH } from "@/lib/constants";
import { CONFIG } from "@/lib/constants/config";
import { capitalize } from "@/lib/utils";
import { addDealSchema } from "@/lib/validator";
import { ProductItemType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type DealFormType = "create" | "edit";

const defaultValue = {
  title: "",
  type: "limited",
  productId: "",
  endTime: undefined,
  description: "",
  discount: 0,
  isActive: false,
};

const DealForm = ({
  type,
  deal,
  dealId,
  deleteButton,
  products,
}: {
  type: DealFormType;
  deal?: z.infer<typeof addDealSchema>;
  dealId?: string;
  deleteButton?: ReactNode;
  products: ProductItemType[];
}) => {
  const router = useRouter();
  const isEdit = type === "edit";
  const form = useForm<z.infer<typeof addDealSchema>>({
    resolver: zodResolver(addDealSchema),
    defaultValues: deal && isEdit ? deal : defaultValue,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = { ...values };
    const { success, message } = isEdit
      ? await updateDeal({ ...formData, id: dealId })
      : await createDeal(formData);

    if (!success) {
      toast({ variant: "destructive", description: message });
      return;
    }
    router.replace(PATH.DEALS);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* type */}
        <FormInput placeholder="Enter Deal Type" name="type" disabled />
        {/* todo select */}
        {/* title */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormInput placeholder="Enter Deal Title" name="title" />
        </div>
        {/* description */}
        <FormInput
          type="textarea"
          placeholder="Enter Deal Description"
          name="description"
        />
        {/* product */}
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Product</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[200px]">
                  {products.map(({ name, id, images }) => (
                    <SelectItem key={id} value={id}>
                      <span className="flex items-center gap-3">
                        <Image
                          src={`https://${CONFIG.IMAGE_URL}/product/${images[0]}`}
                          width={30}
                          height={30}
                          alt=""
                        />
                        {capitalize(name)}
                      </span>
                      {/* {capitalize(name)} */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* discount */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormInput
            placeholder="Enter Discount"
            name="discount"
            type="number"
          />
        </div>
        {/* end-time */}
        <FormInput
          placeholder="Enter Deal Type"
          name="endTime"
          type="datetime-local"
        />
        {/* buttons */}
        <div className="flex gap-2">
          {/* submit */}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Submitting"
              : `${capitalize(type)} Deal`}
          </Button>
          {deleteButton}
        </div>
      </form>
    </Form>
  );
};

export default DealForm;
