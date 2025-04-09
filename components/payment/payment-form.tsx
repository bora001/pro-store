"use client";

import { paymentSchema } from "@/lib/validator";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PAYMENT_METHODS } from "@/lib/constants";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
export type PaymentFormType = z.infer<typeof paymentSchema>;

const PaymentForm = () => {
  const router = useRouter();
  const [currentMethod, setCurrentMethod] = useState<PaymentFormType["type"]>();
  const placeOrder = () => {
    if (!currentMethod) {
      toast({
        variant: "destructive",
        description: "Please select a payment methods",
      });
      return;
    }
    router.push(`/place-order?method=${currentMethod}`);
  };
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">Payment methods</h1>
      <p className="text-sm text-muted-foreground">
        Please select Payment method
      </p>
      <RadioGroup
        className="flex flex-col space-y-2"
        onValueChange={(method: PaymentFormType["type"]) =>
          setCurrentMethod(method)
        }
      >
        {PAYMENT_METHODS.map((method) => (
          <div className="flex items-center space-x-2" key={method}>
            <RadioGroupItem
              id={method}
              value={method}
              checked={currentMethod === method}
            />
            <label htmlFor={method}>{method}</label>
          </div>
        ))}
      </RadioGroup>
      <Button className="w-full" onClick={placeOrder}>
        Continue
      </Button>
    </div>
  );
};

export default PaymentForm;
