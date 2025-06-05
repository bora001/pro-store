"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import ProductPrice from "./product-price";
import { ProductItemType } from "@/types";
import { PATH } from "@/lib/constants";
import RatingStar from "../common/rating-star";
import { Badge } from "../ui/badge";
import S3Image from "../common/S3Image";
import ProductDiscountBadge from "../product/product-discount-badge";
import ProductBadge from "../common/product-badge";
import { useCallback, useEffect, useState } from "react";
import { useWebsocketConnector } from "@/hooks/use-websocket-connector";
import { PUBLISH_KEYS } from "@/websocket/constants";

const PRODUCT_CARD_IMAGE_SIZE = 306;

const ProductCard = ({
  product: { slug, images, name, brand, rating, stock, price, Deal, id },
}: {
  product: ProductItemType;
}) => {
  const endTime = String(Deal?.[0]?.endTime || "");
  const [currentQty, setCurrentQty] = useState<number>(stock || 0);
  const [soldOut, setSoldOut] = useState(stock === 0);

  useEffect(() => {
    setSoldOut(stock === 0);
    setCurrentQty(stock || 0);
  }, [stock]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const message = JSON.parse(e.data);
        if (message.type === PUBLISH_KEYS.INVENTORY_UPDATE && message.data?.productId === id) {
          setCurrentQty(message.data.qty);
          setSoldOut(message.data.soldOut);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    },
    [id]
  );

  useWebsocketConnector({
    id,
    channels: [PUBLISH_KEYS.INVENTORY_UPDATE],
    onMessage,
    enabled: Boolean(Deal && Deal.length > 0),
  });

  return (
    <Card className={`w-full md:max-w-sm ${soldOut ? "filter grayscale" : ""}`}>
      {/* overlay */}
      {soldOut && <div className="absolute inset-0 bg-gray-300 bg-opacity-40 rounded-2xl pointer-events-none z-10" />}

      {/* header */}
      <div className="relative">
        {soldOut || currentQty < 5 ? (
          <ProductBadge
            text={soldOut ? "Sold Out" : `${currentQty} Left`}
            className="py-1 text-xs z-30"
            variant={soldOut ? undefined : "orange"}
            position="top-left"
          />
        ) : null}
        {!soldOut && <ProductDiscountBadge endTime={endTime} discount={Deal[0]?.discount} />}

        <CardHeader className="items-center p-0">
          <Link href={`${PATH.PRODUCT}/${slug}`} className={soldOut ? STYLE.LINK_DISABLED : ""}>
            <S3Image
              className="rounded-2xl"
              folder="product"
              fileName={String(images[0])}
              alt={name}
              size={PRODUCT_CARD_IMAGE_SIZE}
              priority
            />
          </Link>
        </CardHeader>
      </div>

      {/* content */}
      <CardContent className="p-4 grid gap-4">
        <p className="text-xs">{brand}</p>
        <Link href={`${PATH.PRODUCT}/${slug}`} className={soldOut ? STYLE.LINK_DISABLED : ""}>
          <h2 className="text-sm font-medium line-clamp-2 h-[38px]">{name}</h2>
        </Link>

        <div className="flex-between gap-4">
          <RatingStar rating={rating} />
          {stock > 0 ? (
            <ProductPrice discount={Deal?.[0]?.discount} endTime={endTime} price={price} />
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

const STYLE = {
  LINK_DISABLED: "pointer-events-none cursor-not-allowed",
};
