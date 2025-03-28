import { auth } from "@/auth";
import CheckoutStep from "@/components/cart/checkout-step";
import PlacerOrderForm from "@/components/place-order/place-order-form";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.action";
import { PATH } from "@/lib/constants";
import { Shipping } from "@/types";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Place Order",
};
const PlaceOrderPage = async () => {
  const session = await auth();
  const cart = await getMyCart();
  if (!session?.user?.id) redirect(PATH.SIGN_IN);
  if (!cart?.data || !cart.data.items.length) redirect(PATH.CART);
  const user = await getUserById(session?.user?.id);
  if (!user.address) redirect(PATH.SHIPPING);

  return (
    <>
      <CheckoutStep step="Place Order" />
      <PlacerOrderForm address={user.address as Shipping} cart={cart?.data} />
    </>
  );
};

export default PlaceOrderPage;
