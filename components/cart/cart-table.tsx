"use client";
import { CartType, addDealType } from "@/types";
import { Card, CardContent } from "../ui/card";
import { calculatePrice } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ButtonWithTransition from "../custom/ButtonWithTransition";
import { PATH } from "@/lib/constants";
import ProductTable from "../common/product-table";
import Container from "../common/container";
import ListContainer from "../common/list-container";
import ProductDealTimer from "../product/product-deal-timer";
import PriceSummaryWithArray from "../common/price-summary-with-array";

const CartTable = ({ cart, deal }: { cart?: CartType; deal?: addDealType }) => {
  const [isPending, startTransition] = useTransition();
  const [isActiveDeal, setIsActiveDeal] = useState(false);
  const router = useRouter();
  const [price, setPrice] = useState<[string, number][]>([]);
  useEffect(() => {
    setPrice(
      Object.entries(calculatePrice(cart?.items || [], deal, isActiveDeal))
    );
  }, [cart?.items, deal, isActiveDeal]);

  return (
    <Container title="Shopping Cart">
      <ListContainer
        listLength={cart?.items.length || 0}
        title="Cart is empty..."
        href={PATH.HOME}
        linkText="Go to shopping"
      >
        {cart && (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <ProductTable
                items={cart.items}
                deal={deal}
                isActiveDeal={isActiveDeal}
              />
            </div>
            {/* cart detail */}
            <Card className="overflow-hidden">
              <ProductDealTimer
                endTime={String(deal?.endTime || "")}
                className="relative"
                setIsActiveDeal={setIsActiveDeal}
                noRound
              />
              <CardContent className="p-4 gap-3 ">
                <div className="text-xl space-y-5 mb-5">
                  <p className="space-x-2">
                    <span>Total</span>
                    <span className="text-gray-500 text-base">
                      ({cart.items.reduce((acc, cur) => acc + cur.qty, 0)})
                    </span>
                  </p>
                  <PriceSummaryWithArray price={price} />
                </div>
                <ButtonWithTransition
                  isPending={isPending}
                  onClick={() =>
                    startTransition(() => router.push(PATH.SHIPPING))
                  }
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
