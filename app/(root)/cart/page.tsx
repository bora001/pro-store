import CartTable from "@/components/cart/cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";

export const metadata = {
  title: "Cart",
};
const CartPage = async () => {
  const cart = (await getMyCart()) as Cart;
  return <CartTable cart={cart} />;
};

export default CartPage;
