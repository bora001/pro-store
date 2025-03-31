"use client";
import { Cart, Shipping } from "@/types";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { PATH } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { useTransition } from "react";
import { createOrder } from "@/lib/actions/order.actions";
import PriceSummary from "../common/price-summary";

const PlacerOrderForm = ({
  address,
  cart,
}: {
  address: Shipping;
  cart: Cart;
}) => {
  const searchParams = useSearchParams(); // Accessing query params
  const method = searchParams.get("method");
  const [isPending, startTransition] = useTransition();
  const handlePlaceOrder = () => {
    startTransition(async () => {
      await createOrder(method);
    });
  };
  return (
    <>
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          {/* shipping */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{address.name}</p>
              <p>
                {address.address}, {address.city}, {address.postalCode},{" "}
                {address.country}
              </p>
              <div className="mt-3">
                <Link href={PATH.SHIPPING}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          {/* payment */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{method}</p>
              <div className="mt-3">
                <Link href={PATH.SHIPPING}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          {/* order */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                {/* body */}
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      {/* image */}
                      <TableCell>
                        <Link
                          href={`${PATH.PRODUCT}/${item.slug}`}
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
                      {/* qty */}
                      <TableCell>{item.qty}</TableCell>
                      {/* price */}
                      <TableCell className="text-right">
                        $ {item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {/*  */}
        <div>
          <PriceSummary
            itemPrice={cart.itemPrice}
            taxPrice={cart.taxPrice}
            shippingPrice={cart.shippingPrice}
            totalPrice={cart.totalPrice}
          />
          <Button
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={isPending}
          >
            Place Order
          </Button>
        </div>
      </div>
    </>
  );
};

export default PlacerOrderForm;
