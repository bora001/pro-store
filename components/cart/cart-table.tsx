"use client";
import { Cart } from "@/types";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import ItemQtyChanger from "./item-qty-changer";
import { Card, CardContent } from "../ui/card";
import { currencyFormatter } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import ItemRemoveButton from "./item-remove-button";

const CartTable = ({ cart }: { cart: Cart }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="flex items-center flex-col justify-center h-full gap-4">
          <p>Cart is empty...</p>
          <Button>
            <Link href="/">Go to shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              {/* header */}
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                </TableRow>
              </TableHeader>
              {/* body */}
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    {/* image, name */}
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    {/* quantity */}
                    <TableCell className="flex-center gap-2">
                      <ItemQtyChanger item={item} />
                    </TableCell>
                    {/* price */}
                    <TableCell className="text-center">
                      $ {item.price}
                    </TableCell>
                    <TableCell>
                      <ItemRemoveButton item={item} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
