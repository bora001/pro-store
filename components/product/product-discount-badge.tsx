"use client";
import useGetCountdown from "@/hooks/use-get-countdown";
import { cn } from "@/lib/utils";

const ProductDiscountBadge = ({
  discount,
  endTime,
}: {
  discount: number;
  endTime: string;
}) => {
  const { isEnded } = useGetCountdown(endTime || "", "array");

  return (
    <div
      className={cn(
        discount && !isEnded ? "flex" : "hidden",
        "absolute bg-red-500 text-white font-semibold px-2 py-3 rounded-lg shadow-md -top-2 right-2"
      )}
    >
      {discount}%
    </div>
  );
};

export default ProductDiscountBadge;
