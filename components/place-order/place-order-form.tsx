"use client";
import { CartType, PaymentType, ShippingType, addDealType } from "@/types";
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
import { useEffect, useState, useTransition } from "react";
import { createOrder } from "@/lib/actions/order.actions";
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
  address: ShippingType;
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
      toast({
        variant: success ? "default" : "destructive",
        description: message,
      });
    });
  };

  useEffect(() => {
    setPrice(
      Object.entries(calculatePrice(cart?.items || [], deal, isActiveDeal))
    );
  }, [cart?.items, deal, isActiveDeal]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="py-4 h2-bold">Place Order</h1>
        <div className="flex gap-1 items-center text-gray-600 px-2">
          <BadgeAlert className="mx-1" size="16" />
          <p>Just a demo site—no real transactions occur</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 md:gap-5">
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
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                {/* body : image + qty + price */}
                <TableBody>
                  {cart.items.map(
                    ({ productId, slug, name, image, qty, price }) => {
                      const discountCondition =
                        productId === deal?.productId && isActiveDeal;

                      return (
                        <TableRow key={slug}>
                          {/* image */}
                          <TableCell>
                            <Link
                              href={`${PATH.PRODUCT}/${slug}`}
                              className="flex items-center"
                            >
                              <S3Image
                                folder="product"
                                fileName={image}
                                alt={name}
                                size={PLACE_ORDER_IMAGE_SIZE}
                              />
                              <div>
                                <span className="px-2">{name}</span>
                                {discountCondition && (
                                  <DiscountBadge discount={discount || 0} />
                                )}
                              </div>
                            </Link>
                          </TableCell>
                          {/* qty */}
                          <TableCell>{qty}</TableCell>
                          {/* price */}
                          <TableCell className="text-right">
                            {`$ ${discountPrice(
                              +price,
                              discount,
                              discountCondition
                            )}`}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {/* summary + place-order */}
        <div className="space-y-4">
          <Card className={cn("overflow-hidden")}>
            {deal && (
              <ProductDealTimer
                endTime={String(endTime || "")}
                className="relative"
                setIsActiveDeal={setIsActiveDeal}
                noRound
              />
            )}
            <CardContent>
              <div className={cn("space-y-1 mt-5")}>
                <PriceSummaryWithArray price={price} />
              </div>
            </CardContent>
          </Card>
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
