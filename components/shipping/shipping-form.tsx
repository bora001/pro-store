"use client";

import { shippingSchema } from "@/lib/validator";
import { Shipping } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import ShippingField from "./shipping-form-field";
import ButtonWithTransition from "../custom/ButtonWithTransition";
import { useTransition } from "react";
import { updateUserAddress } from "@/lib/actions/user.action";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type ShippingFormType = z.infer<typeof shippingSchema>;
const ShippingForm = ({ address }: { address?: Shipping }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ShippingFormType>({
    resolver: zodResolver(shippingSchema),
    defaultValues: address,
  });
  const onSubmit = (values: ShippingFormType) => {
    startTransition(async () => {
      const { success, message } = await updateUserAddress(values);
      if (success) {
        router.push("/payment-method");
      } else {
        toast({ variant: "destructive", description: message as string });
      }
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter and address to shipping
        </p>
        {/* Form */}
        <FormProvider {...form}>
          <Form {...form}>
            <form
              method="post"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <ShippingField title="name" placeholder="enter your name" />
              <ShippingField title="address" placeholder="enter your address" />
              <ShippingField title="city" placeholder="enter your city" />
              <ShippingField
                title="postalCode"
                placeholder="enter your postal code"
              />
              <ShippingField title="country" placeholder="enter your country" />
              <div className="flex gap-2">
                <ButtonWithTransition
                  isPending={isPending}
                  title="Continue"
                  type="submit"
                />
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </>
  );
};

export default ShippingForm;
