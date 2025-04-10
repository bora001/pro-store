"use client";
import { Minus, Plus } from "lucide-react";
import Flex from "../common/flex";
import { Button } from "../ui/button";
import { CartItemType } from "@/types";
import { useTransition } from "react";
import {
  modifyItemQtyToCart,
  removeItemToCart,
} from "@/lib/actions/cart.actions";
import { toast } from "@/hooks/use-toast";

const TYPE = ["minus", "qty", "plus"];
const ItemQtyChanger = ({
  item,
  isView,
}: {
  item: CartItemType;
  isView?: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const handleItemQty = (type: string) => {
    const qty = type === "plus" ? item.qty + 1 : item.qty - 1;
    startTransition(async () => {
      const { success, message } = qty
        ? await modifyItemQtyToCart(item, qty)
        : await removeItemToCart(item);
      toast({
        variant: success ? "default" : "destructive",
        description: message,
      });
    });
  };
  return (
    <Flex className="justify-between">
      {TYPE.map((type) =>
        type === "qty" ? (
          <span
            key={type}
            className="w-12 text-center"
            data-testid="product-qty"
          >
            {item.qty}
          </span>
        ) : (
          <Button
            key={type}
            className={isView ? "hidden" : "block"}
            variant="outline"
            onClick={() => handleItemQty(type)}
            disabled={isPending}
            data-testid={`handle-qty-${type}`}
          >
            {type === "plus" ? <Plus /> : <Minus />}
          </Button>
        )
      )}
    </Flex>
  );
};

export default ItemQtyChanger;
