"use client";
import { cn, divideByDecimal } from "@/lib/utils";
import OriginalPrice from "./original-price";
import { discountPrice } from "@/utils/price/discountPrice";
import useGetCountdown from "@/hooks/use-get-countdown";
import Text from "../custom/text";

type ProductPricePropsType = {
  unit?: string;
  price: string;
  className?: string;
  endTime?: string;
  discount?: number;
};
const ProductPrice = ({ unit = "$", price, className, endTime, discount }: ProductPricePropsType) => {
  const { isEnded } = useGetCountdown(endTime || "", "array");
  const [whole, fraction] = divideByDecimal(discountPrice(+price, discount, !!discount));
  const [original_whole, original_fraction] = divideByDecimal(+price);
  const isActive = endTime && !isEnded;
  return (
    <div className={"flex gap-1"}>
      {isActive && (
        <OriginalPrice
          isEnd={isEnded}
          price={`${unit}
          ${original_whole}.${original_fraction}`}
        />
      )}
      <div className={cn("text-xl flex leading-[1] items-center", "text-red-600 font-bold", className)}>
        <Text size="xs">{unit}</Text> {isActive ? whole : original_whole}
        <Text size="xs">.{isActive ? fraction : original_fraction}</Text>
      </div>
    </div>
  );
};

export default ProductPrice;
