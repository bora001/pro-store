"use client";

import { Minus, Plus } from "lucide-react";
import Flex from "../common/flex";
import { Button, ButtonProps } from "../ui/button";
import { CartItemType } from "@/types";
import { useTransition } from "react";
import { modifyItemQtyToCart, removeItemToCart } from "@/lib/actions/handler/cart.actions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TYPE = ["minus", "qty", "plus"];
type ItemQtyChangerPropsType = {
  item: CartItemType;
  isView?: boolean;
  size?: ButtonProps["size"];
  cartId?: string;
};
const ItemQtyChanger = ({ item, isView, size = "default", cartId }: ItemQtyChangerPropsType) => {
  const [isPending, startTransition] = useTransition();
  const handleItemQty = (type: string) => {
    if (!cartId) return;
    const qty = type === "plus" ? item.qty + 1 : item.qty - 1;
    startTransition(async () => {
      const { success, message } = qty
        ? await modifyItemQtyToCart({ data: item, qty, cartId })
        : await removeItemToCart({ ...item, cartId });
      toast({ variant: success ? "default" : "destructive", description: message });
    });
  };
  return (
    <Flex className="justify-between gap-2">
      {TYPE.map((type) =>
        type === "qty" ? (
          <span key={type} className={cn("w-12 text-center mx-auto")} data-testid="product-qty">
            {item.qty}
          </span>
        ) : (
          <Button
            key={type}
            className={cn(size === "sm" && "p-3 w-0 h-0 flex items-center justify-center", isView ? "hidden" : "block")}
            size={size}
            variant="outline"
            onClick={() => handleItemQty(type)}
            disabled={isPending}
            data-testid={`handle-qty-${type}`}
            aria-label={`${type}-item-qty`}
          >
            {type === "plus" ? <Plus /> : <Minus />}
          </Button>
        )
      )}
    </Flex>
  );
};

export default ItemQtyChanger;
