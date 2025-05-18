"use client";

import { CartItemType } from "@/types";
import { Button } from "../ui/button";
import { addItemToCart } from "@/lib/actions/handler/cart.actions";
import { toast } from "@/hooks/use-toast";
import { Minus, Plus } from "lucide-react";
import Flex from "../common/flex";
import { useEffect, useState, useTransition } from "react";
import { PATH } from "@/lib/constants";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { checkSessionCardId, getUserInfo } from "@/lib/actions/utils/session.utils";
import MoveButtonToast from "../custom/move-button-toast";
import IconButton from "../custom/IconButton";

export type CartInfoType = { sessionCartId: string; userId?: string };

const AddToCart = ({ item, noQty, className }: { item: CartItemType; noQty?: boolean; className?: ClassValue }) => {
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [cartInfo, setCartInfo] = useState<CartInfoType>({ sessionCartId: "", userId: undefined });

  useEffect(() => {
    const preloadCartInfo = async () => {
      const [sessionCartId, userId] = await Promise.all([checkSessionCardId(), getUserInfo()]);
      setCartInfo({ sessionCartId, userId });
    };
    preloadCartInfo();
  }, []);

  const handleAddCart = () => {
    startTransition(async () => {
      if (!cartInfo.sessionCartId) {
        toast({ variant: "destructive", description: "Failed to load cart information. Please try again shortly." });
        return;
      }
      const { success, message } = await addItemToCart({ data: item, qty, ...cartInfo });
      if (!success) {
        toast({ variant: "destructive", description: message });
      } else {
        toast({ description: message, action: <MoveButtonToast text="go to cart" path={PATH.CART} /> });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {!noQty && (
        <Flex className="justify-between">
          <IconButton
            aria-label="decrease-item-qty"
            variant="outline"
            onClick={() => setQty((prev) => prev - 1)}
            disabled={qty === 1}
            icon={<Minus />}
          />
          <span className="w-12 text-center">{qty}</span>
          <IconButton
            aria-label="increase-item-qty"
            variant="outline"
            onClick={() => setQty((prev) => prev + 1)}
            disabled={qty === 99}
            icon={<Plus />}
          />
        </Flex>
      )}
      <Button className={cn(className)} disabled={isPending} onClick={handleAddCart}>
        Add to Cart
      </Button>
    </div>
  );
};

export default AddToCart;
