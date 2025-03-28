"use client";
import { Minus, Plus } from "lucide-react";
import Flex from "../common/flex";
import { Button } from "../ui/button";
import { CartItem } from "@/types";
import { useTransition } from "react";
import {
  modifyItemQtyToCart,
  removeItemToCart,
} from "@/lib/actions/cart.actions";
import { toast } from "@/hooks/use-toast";

const ItemQtyChanger = ({
  item,
  isView,
}: {
  item: CartItem;
  isView?: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const handleItemQty = (type: string) => {
    const qty = type === "plus" ? item.qty + 1 : item.qty - 1;
    startTransition(async () => {
      if (qty) {
        //modify
        const { success, message } = await modifyItemQtyToCart(item, qty);
        if (!success) {
          toast({ variant: "destructive", description: message });
        } else {
          toast({
            description: message,
          });
        }
      } else {
        // remove
        const { success, message } = await removeItemToCart(item);
        if (!success) {
          toast({ variant: "destructive", description: message });
        } else {
          toast({
            description: message,
          });
        }
      }
    });
  };
  return (
    <Flex className="justify-between">
      <Button
        className={isView ? "hidden" : "block"}
        variant="outline"
        onClick={() => handleItemQty("minus")}
        disabled={isPending}
      >
        <Minus />
      </Button>
      <span className="w-12 text-center">{item.qty}</span>
      <Button
        className={isView ? "hidden" : "block"}
        variant="outline"
        onClick={() => handleItemQty("plus")}
        disabled={isPending}
      >
        <Plus />
      </Button>
    </Flex>
  );
};

export default ItemQtyChanger;
