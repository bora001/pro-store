import { auth } from "@/auth";
import CheckoutStep from "@/components/cart/checkout-step";
import PlacerOrderForm from "@/components/place-order/place-order-form";
import { hasIncludedDeal } from "@/lib/actions/handler/admin/admin.deal.actions";
import { getMyCart } from "@/lib/actions/handler/cart.actions";
import { getUserById } from "@/lib/actions/handler/user.action";
import { PATH } from "@/lib/constants";
import { ShippingType } from "@/types";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Place Order",
};
const PlaceOrderPage = async () => {
  const session = await auth();
  const cart = await getMyCart();
  if (!session?.user?.id) redirect(PATH.SIGN_IN);
  if (!cart?.data || !cart.data.items.length) redirect(PATH.CART);
  const { data: user } = await getUserById(session?.user?.id);
  if (!user?.address) redirect(PATH.SHIPPING);
  const { data } = await hasIncludedDeal({ items: cart?.data?.items || [] });

  return (
    <>
      <CheckoutStep step="Place Order" />
      <PlacerOrderForm
        address={user.address as ShippingType}
        cart={cart?.data}
        deal={data}
      />
    </>
  );
};

export default PlaceOrderPage;
