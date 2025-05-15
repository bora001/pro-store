import { auth } from "@/auth";
import CheckoutStep from "@/components/cart/checkout-step";
import ShippingForm from "@/components/shipping/shipping-form";
import { getMyCart } from "@/lib/actions/handler/cart.actions";
import { getUserById } from "@/lib/actions/handler/user.action";
import { PATH } from "@/lib/constants";
import { ShippingType } from "@/types";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Shipping",
};
const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.data?.items.length === 0) redirect(PATH.CART);
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("no userId");
  const { data: user } = await getUserById(userId);
  return (
    <>
      <CheckoutStep step="Shipping Address" />
      <ShippingForm address={user?.address as ShippingType} />
    </>
  );
};

export default ShippingAddressPage;
