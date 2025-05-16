"use client";

import { CartItemType } from "@/types";
import { Button } from "../ui/button";
import { ToastAction } from "../ui/toast";
import { addItemToCart } from "@/lib/actions/handler/cart.actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import Flex from "../common/flex";
import { useEffect, useState, useTransition } from "react";
import { PATH } from "@/lib/constants";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { getCartId } from "@/lib/actions/services/cart.service";

const AddToCart = ({ item, noQty, className }: { item: CartItemType; noQty?: boolean; className?: ClassValue }) => {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [cartId, setCartId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const preloadCartId = async () => {
      const id = await getCartId();
      setCartId(id);
    };
    preloadCartId();
  }, []);

  const handleAddCart = () => {
    startTransition(async () => {
      const { success, message } = await addItemToCart({ data: item, qty, cartId });
      if (!success) {
        toast({ variant: "destructive", description: message });
      } else {
        toast({
          description: message,
          action: (
            <ToastAction
              className="bg-primary text-white hover:bg-gray-800"
              altText="go to cart"
              onClick={() => router.push(PATH.CART)}
            >
              Go to Cart
            </ToastAction>
          ),
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {!noQty && (
        <Flex className="justify-between">
          <Button
            variant="outline"
            onClick={() => setQty((prev) => prev - 1)}
            disabled={qty === 1}
            aria-label="decrease-item-qty"
          >
            <Minus />
          </Button>
          <span className="w-12 text-center">{qty}</span>
          <Button
            variant="outline"
            onClick={() => setQty((prev) => prev + 1)}
            disabled={qty === 99}
            aria-label="increase-item-qty"
          >
            <Plus />
          </Button>
        </Flex>
      )}
      <Button className={cn(className)} disabled={isPending} onClick={handleAddCart}>
        Add to Cart
      </Button>
    </div>
  );
};

export default AddToCart;
