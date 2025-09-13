import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import StripeForm from "./stripe-form";
const StripePayment = ({
  orderId,
  priceInCents,
  clientSecret,
}: {
  orderId: string;
  priceInCents: string;
  clientSecret: string;
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
  const { theme, systemTheme } = useTheme();
  const stripeTheme = () => {
    if (theme === "dark") return "night";
    if (theme === "light") return "stripe";
    if (systemTheme === "light") return "flat";
    if (systemTheme === "dark") return "night";
    return "stripe";
  };

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme: stripeTheme(),
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  );
};

export default StripePayment;
