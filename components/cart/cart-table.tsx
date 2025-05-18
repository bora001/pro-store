"use client";
import { CartType, addDealType } from "@/types";
import { Card, CardContent } from "../ui/card";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ButtonWithTransition from "../custom/button-with-transition";
import { PATH } from "@/lib/constants";
import ProductTable from "../common/product-table";
import Container from "../common/container";
import ListContainer from "../common/list-container";
import ProductDealTimer from "../product/product-deal-timer/product-deal-timer";
import PriceSummaryWithArray from "../common/price-summary-with-array";
import { calculatePrice } from "@/utils/price/calculate-price";
import { toast } from "@/hooks/use-toast";

const CartTable = ({ cart, deal }: { cart?: CartType; deal?: addDealType }) => {
  const [isPending, startTransition] = useTransition();
  const [isActiveDeal, setIsActiveDeal] = useState(false);
  const router = useRouter();
  const [price, setPrice] = useState<[string, string][]>([]);
  useEffect(() => {
    setPrice(Object.entries(calculatePrice(cart?.items || [], deal, isActiveDeal)));
  }, [cart?.items, deal, isActiveDeal]);

  const startOrder = () => {
    startTransition(() => {
      const validCart = cart?.items.every((item) => item.qty > 0);
      if (!validCart) {
        toast({ variant: "destructive", description: "Please remove sold out items from cart" });
        return;
      }
      router.push(PATH.SHIPPING);
    });
  };

  return (
    <Container title="Shopping Cart">
      <ListContainer
        listLength={cart?.items?.length || 0}
        title="Cart is empty..."
        href={PATH.HOME}
        linkText="Go to shopping"
      >
        {cart && (
          <div className="flex flex-col-reverse lg:flex-row w-full gap-5 items-center lg:items-start">
            <div className="overflow-x-auto  flex-1 sm:basis-2/3  md:basis-5/7 lg:basis-3/4 w-full">
              <ProductTable cartId={cart.id} items={cart.items} deal={deal} isActiveDeal={isActiveDeal} />
            </div>
            {/* cart detail */}
            <Card className="overflow-hidden flex-1 sm:basis-1/3 md:basis-2/7 lg:basis-1/4 sm:max-w-md max-w-full w-full">
              <ProductDealTimer
                isActiveDeal={deal && isActiveDeal}
                endTime={String(deal?.endTime || "")}
                className="relative"
                setIsActiveDeal={setIsActiveDeal}
                noRound
              />
              <CardContent className="p-4 gap-3 ">
                <div className="text-xl space-y-5 mb-5">
                  <p className="space-x-2">
                    <span>Total</span>
                    <span className="text-gray-500 text-base">({cart.itemsCount})</span>
                  </p>
                  <PriceSummaryWithArray price={price} />
                </div>
                <ButtonWithTransition
                  isPending={isPending}
                  onClick={startOrder}
                  leftIcon={<ArrowRight />}
                  title="Proceed to Checkout"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </ListContainer>
    </Container>
  );
};

export default CartTable;
