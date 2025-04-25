import LinkButton from "@/components/custom/LinkButton";
import { ButtonProps } from "@/components/ui/button";
import { PATH } from "@/lib/constants";
import { ShoppingCart } from "lucide-react";

const CartIconButton = (props: ButtonProps) => {
  return (
    <LinkButton
      {...{ variant: "ghost", ...props }}
      icon={<ShoppingCart />}
      title="Cart"
      url={PATH.CART}
    />
  );
};

export default CartIconButton;
