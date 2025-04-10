"use client";
import { cn, divideByDecimal } from "@/lib/utils";
import Text from "../custom/Text";
import OriginalPrice from "./original-price";
import { useState } from "react";
import { discountPrice } from "@/utils/price/discountPrice";

const ProductPrice = ({
  unit = "$",
  price,
  className,
  endTime,
  discount,
}: {
  unit?: string;
  price: string;
  className?: string;
  endTime?: string;
  discount?: number;
}) => {
  const [whole, fraction] = divideByDecimal(
    discountPrice(+price, discount, !!discount)
  );
  const [original_whole, original_fraction] = divideByDecimal(+price);
  const [isActiveDeal, setIsActiveDeal] = useState(
    endTime ? endTime?.length > 0 : false
  );
  return (
    <div className={"flex gap-1"}>
      {(endTime || isActiveDeal) && (
        <OriginalPrice
          setIsActiveDeal={setIsActiveDeal}
          endTime={endTime || ""}
          price={`${unit}
          ${original_whole}.${original_fraction}`}
        />
      )}
      <div
        className={cn(
          "text-xl flex leading-[1] items-center",
          "text-red-600 font-bold",
          className
        )}
      >
        <Text size="xs">{unit}</Text> {whole}
        <Text size="xs">.{fraction}</Text>
      </div>
    </div>
  );
};

export default ProductPrice;
