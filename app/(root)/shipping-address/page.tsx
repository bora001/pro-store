import CheckoutStep from "@/components/cart/checkout-step";
import ShippingForm from "@/components/shipping/shipping-form";
import { getMyCart } from "@/lib/actions/handler/cart.actions";
import { getUserById } from "@/lib/actions/handler/user.action";
import { getUserInfo } from "@/lib/actions/utils/session.utils";
import { PATH } from "@/lib/constants";
import { ShippingSchemaType } from "@/types";
import { redirect } from "next/navigation";

export const metadata = { title: "Shipping" };

const ShippingAddressPage = async () => {
  const userId = await getUserInfo();
  if (!userId) throw new Error("no userId");
  const cart = await getMyCart(userId);
  if (!cart || cart.data?.items.length === 0) redirect(PATH.CART);
  const { data: user } = await getUserById(userId);
  return (
    <>
      <CheckoutStep step="Shipping Address" />
      <ShippingForm address={user?.address as ShippingSchemaType} />
    </>
  );
};

export default ShippingAddressPage;
