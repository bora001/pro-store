"use client";
import { Cart } from "@/types";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { currencyFormatter } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import ButtonWithTransition from "../custom/ButtonWithTransition";
import { PATH } from "@/lib/constants";
import ProductTable from "../common/product-table";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="flex items-center flex-col justify-center h-full gap-4">
          <p>Cart is empty...</p>
          <Button>
            <Link href={PATH.HOME}>Go to shopping</Link>
          </Button>
        </div>
      ) : (
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
    </>
  );
};

export default CartTable;
