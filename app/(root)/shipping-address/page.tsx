import { auth } from "@/auth";
import CheckoutStep from "@/components/cart/checkout-step";
import ShippingForm from "@/components/shipping/shipping-form";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.action";
import { Shipping } from "@/types";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Shipping",
};
const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.data?.items.length === 0) redirect("/cart");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("no userId");
  const user = await getUserById(userId);
  return (
    <>
      <CheckoutStep step={0} />
      <ShippingForm address={user.address as Shipping} />
    </>
  );
};

export default ShippingAddressPage;
