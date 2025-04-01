import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { PATH } from "@/lib/constants";
import { CONFIG } from "@/lib/constants/config";

const StripeForm = ({
  priceInCents,
  orderId,
}: {
  priceInCents: string;
  orderId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const notValid = stripe === null || elements === null;
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (notValid || email === null) return;
    setIsLoading(true);
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${CONFIG.APP_URL}/${PATH.ORDER}/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        const unknownError = "An unknown error occurred";
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message ?? unknownError);
        } else if (error) {
          setErrorMessage(unknownError);
        }
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="text-xl">Stripe Checkout</div>
      {errorMessage && <div className="text-destructive">{errorMessage}</div>}
      <PaymentElement />
      <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      <Button className="w-full" disabled={notValid || isLoading}>
        {isLoading ? "Purchasing" : `Purchase $${priceInCents}`}
      </Button>
    </form>
  );
};

export default StripeForm;
