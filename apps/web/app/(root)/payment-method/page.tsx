import CheckoutStep from "@/components/cart/checkout-step";
import PaymentForm from "@/components/payment/payment-form";

export const metadata = {
  title: "Payment",
};
const PaymentMethod = () => {
  return (
    <>
      <CheckoutStep step="Payment Method" />
      <PaymentForm />
    </>
  );
};

export default PaymentMethod;
