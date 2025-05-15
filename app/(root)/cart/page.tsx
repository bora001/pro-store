import CartTable from "@/components/cart/cart-table";
import { hasIncludedDeal } from "@/lib/actions/handler/admin/admin.deal.actions";
import { getMyCart } from "@/lib/actions/handler/cart.actions";

export const metadata = {
  title: "Cart",
};
const CartPage = async () => {
  const cart = await getMyCart();
  const { data } = await hasIncludedDeal({ items: cart?.data?.items || [] });
  return <CartTable cart={cart?.data} deal={data} />;
};

export default CartPage;
