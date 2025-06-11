"use client";

import Image from "next/image";
import { CardContent } from "../../ui/card";
import { PATH } from "@/lib/constants";
import { CONFIG } from "@/lib/constants/config";
import { cn } from "@/lib/utils";
import AddToCart from "../../product/add-to-cart";
import DealCountdownTimer from "./deal-countdown-timer";
import { GetDealType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import DiscountBadge from "../../product/discount-badge";
import { discountPrice } from "@/utils/price/discountPrice";
import ProductBadge from "@/components/common/product-badge";
import { useWebsocketConnector } from "@/hooks/use-websocket-connector";
import { COMMON_CONSTANTS } from "@pro-store-monorepo/common";
const DealCountdownContent = ({ deal, soldOut: dealSoldOut }: { deal: GetDealType; soldOut: boolean }) => {
  const [isActiveDeal, setIsActiveDeal] = useState(true);
  const [currentQty, setCurrentQty] = useState<number>(deal.product?.stock || 0);
  const [soldOut, setSoldOut] = useState(dealSoldOut);
  useEffect(() => {
    setSoldOut(dealSoldOut);
    setCurrentQty(deal.product?.stock || 0);
  }, [deal.product?.stock, dealSoldOut]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const message = JSON.parse(e.data);
        if (
          message.type === COMMON_CONSTANTS.PUBLISH_KEYS.INVENTORY_UPDATE &&
          message.data?.productId === deal.productId
        ) {
          setCurrentQty(message.data.qty);
          setSoldOut(message.data.soldOut);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    },
    [deal.productId]
  );

  useWebsocketConnector({
    id: deal.productId,
    channels: [COMMON_CONSTANTS.PUBLISH_KEYS.INVENTORY_UPDATE],
    onMessage,
    enabled: true,
  });

  return (
    <>
      {soldOut || !isActiveDeal ? (
        <CardContent className="flex flex-col items-center gap-4">
          <div
            className="text-7xl absolute top-1/2 left-1/2 z-10 px-8 py-4 bg-white/60 text-red-700 font-extrabold border-2 border-red-700 shadow-md tracking-wide whitespace-nowrap"
            style={{
              transform: "translate(-50%, -50%) rotate(-12deg)",
            }}
          >
            {!isActiveDeal ? "FINISH" : "SOLD OUT"} 🎉
          </div>

          <Image
            className="brightness-50"
            src={`https://${CONFIG.IMAGE_URL}/product/${deal.product?.images[0]}`}
            alt="Promo"
            width={300}
            height={300}
          />
          <div className="text-lg text-center">
            <p>Thank you so much for your amazing support!</p>
            <p>We’ll be back soon with more great items!</p>
          </div>
        </CardContent>
      ) : (
        <CardContent className={cn("flex justify-center")}>
          <div className="flex gap-8 flex-col lg:flex-row items-center">
            <div className="relative">
              {soldOut || currentQty < 5 ? (
                <ProductBadge
                  text={soldOut ? "Sold Out" : `${currentQty} Left`}
                  className="py-1 text-xs z-30"
                  variant={soldOut ? undefined : "orange"}
                  position="top-left"
                />
              ) : null}
              <div className={cn("rounded-lg overflow-hidden shadow-lg aspect-square relative size-56 lg:size-72")}>
                <Image
                  src={`https://${CONFIG.IMAGE_URL}/product/${deal.product?.images[0]}`}
                  alt="Promo"
                  sizes="100%"
                  fill
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 px-4">
              <p className="text-lg text-center text-primary dark:text-black">{deal.description}</p>
              <DealCountdownTimer
                endTime={String(deal.endTime) || ""}
                isActiveDeal={isActiveDeal}
                setIsActiveDeal={setIsActiveDeal}
              />
              <div className="flex items-center gap-2 my-2">
                <span className="line-through text-sm text-gray-700">{`$${deal.product?.price}`}</span>
                {deal.product && (
                  <span className="text-2xl font-bold text-red-600">
                    {`$${discountPrice(+deal.product.price, deal.discount, !!deal.product)}`}
                  </span>
                )}
                <DiscountBadge
                  discount={deal.discount}
                  className="text-white text-sm font-bold px-2 py-0.5 rounded-full"
                />
              </div>
              <div className="flex gap-2">
                <Link href={`${PATH.PRODUCT}/${deal.product?.slug}`}>
                  <Button>View Product</Button>
                </Link>
                <AddToCart
                  className="bg-red-600 text-white hover:bg-red-700"
                  noQty
                  item={{
                    name: deal.product?.name || "",
                    slug: deal.product?.slug || "",
                    price: deal.product?.price || "0",
                    productId: deal.product?.id || "",
                    qty: 1,
                    image: deal.product?.images[0] || "",
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </>
  );
};

export default DealCountdownContent;
