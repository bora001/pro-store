"use client";

import { CartItemType } from "@/types";
import { Button } from "../ui/button";
import { ToastAction } from "../ui/toast";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import Flex from "../common/flex";
import { useState, useTransition } from "react";
import ButtonWithTransition from "../custom/ButtonWithTransition";
import { PATH } from "@/lib/constants";

const AddToCart = ({ item }: { item: CartItemType }) => {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();
  const handleAddCart = () => {
    startTransition(async () => {
      const { success, message } = await addItemToCart(item, qty);
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
      <Flex className="justify-between">
        <Button
          variant="outline"
          onClick={() => setQty((prev) => prev - 1)}
          disabled={qty === 1}
        >
          <Minus />
        </Button>
        <span className="w-12 text-center">{qty}</span>
        <Button
          variant="outline"
          onClick={() => setQty((prev) => prev + 1)}
          disabled={qty === 99}
        >
          <Plus />
        </Button>
      </Flex>
      <ButtonWithTransition
        isPending={isPending}
        title="Add to Cart"
        onClick={handleAddCart}
      />
    </div>
  );
};

export default AddToCart;
