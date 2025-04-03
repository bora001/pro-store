"use client";
import { CartType } from "@/types";
import { Card, CardContent } from "../ui/card";
import { currencyFormatter } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import ButtonWithTransition from "../custom/ButtonWithTransition";
import { PATH } from "@/lib/constants";
import ProductTable from "../common/product-table";
import Container from "../common/container";
import ListContainer from "../common/list-container";

const CartTable = ({ cart }: { cart?: CartType }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
              <ProductTable items={cart.items} />
            </div>
            {/* cart detail */}
            <Card>
              <CardContent className="p-4 gap-3">
                <div className="pb-3 text-xl">
                  <p className="space-x-2">
                    <span>Total</span>
                    <span className="text-gray-500 text-base">
                      ({cart.items.reduce((acc, cur) => acc + cur.qty, 0)})
                    </span>
                  </p>
                  <p className="font-bold text-right mx-1">
                    {currencyFormatter.format(+cart.itemPrice)}
                  </p>
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
