import CartTable from "@/components/cart/cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";

export const metadata = {
  title: "Cart",
};
const CartPage = async () => {
  const cart = await getMyCart();
  return <CartTable cart={cart?.data} />;
};

export default CartPage;
