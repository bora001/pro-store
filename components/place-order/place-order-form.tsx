"use client";

import { CartType, PaymentType, ShippingSchemaType, addDealType } from "@/types";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { PATH } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useEffect, useState, useTransition } from "react";
import { createOrder } from "@/lib/actions/handler/order.actions";
import { BadgeAlert } from "lucide-react";
import S3Image from "../common/S3Image";
import { cn } from "@/lib/utils";
import ProductDealTimer from "../product/product-deal-timer/product-deal-timer";
import PriceSummaryWithArray from "../common/price-summary-with-array";
import { toast } from "@/hooks/use-toast";
import DiscountBadge from "../product/discount-badge";
import { discountPrice } from "@/utils/price/discountPrice";
import { calculatePrice } from "@/utils/price/calculate-price";

const PLACE_ORDER_IMAGE_SIZE = 50;

const PlacerOrderForm = ({
  address,
  cart,
  deal,
}: {
  address: ShippingSchemaType;
  cart: CartType;
  deal?: addDealType;
}) => {
  const searchParams = useSearchParams();
  const method = searchParams.get("method");
  const [price, setPrice] = useState<[string, string][]>([]);
  const [isActiveDeal, setIsActiveDeal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { address: detail_address, city, postalCode, country, name } = address;
  const { discount, endTime } = deal || {};

  const handlePlaceOrder = () => {
    startTransition(async () => {
      const { success, message } = await createOrder(method as PaymentType);
      toast({ variant: success ? "default" : "destructive", description: message });
    });
  };

  useEffect(() => {
    setPrice(Object.entries(calculatePrice(cart?.items || [], deal, isActiveDeal)));
  }, [cart?.items, deal, isActiveDeal]);

  return (
    <div className="space-y-3 sm:space-y-0">
      <div className="flex justify-between items-center flex-col sm:flex-row">
        <h1 className="py-4 h2-bold">Place Order</h1>
        <div className="flex gap-1 items-center text-gray-600 px-1">
          <BadgeAlert size="16" />
          <p>Just a demo site—no real transactions occur</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 md:gap-5 space-y-4 md:space-y-0">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          {/* shipping */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{name}</p>
              <p>
                {detail_address}, {city}, {postalCode}, {country}
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
                <Link href={PATH.PAYMENT}>
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
                    <TableHead className="border min-w-16">Quantity</TableHead>
                    <TableHead className="border text-right min-w-24">Price</TableHead>
                  </TableRow>
                </TableHeader>
                {/* body : image + qty + price */}
                <TableBody>
                  {cart.items.map(({ productId, slug, name, image, qty, price }) => {
                    const discountCondition = productId === deal?.productId && isActiveDeal;
                    const noQty = qty === 0;

                    return (
                      <TableRow key={slug}>
                        {/* image */}
                        <TableCell>
                          <Link href={`${PATH.PRODUCT}/${slug}`} className="flex items-center gap-2">
                            <S3Image
                              folder="product"
                              fileName={image}
                              alt={name}
                              size={PLACE_ORDER_IMAGE_SIZE}
                              className={`${noQty && "grayscale"} hidden sm:block`}
                            />
                            <div>
                              <span className="pr-2">{name}</span>

                              {discountCondition && <DiscountBadge discount={discount || 0} />}
                            </div>
                          </Link>
                        </TableCell>
                        {/* qty */}
                        <TableCell className="text-center">{qty}</TableCell>
                        {/* price */}
                        <TableCell className="text-right">
                          {`$ ${discountPrice(+price, discount, discountCondition)}`}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {/* summary + place-order */}
        <div className="space-y-4">
          <Card className={cn("overflow-hidden")}>
            <ProductDealTimer
              isActiveDeal={deal && isActiveDeal}
              endTime={String(endTime || "")}
              className="relative"
              setIsActiveDeal={setIsActiveDeal}
              noRound
            />
            <CardContent>
              <div className={cn("space-y-1 mt-5")}>
                <PriceSummaryWithArray price={price} />
              </div>
            </CardContent>
          </Card>
          <Button className="w-full" onClick={handlePlaceOrder} disabled={isPending}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlacerOrderForm;
