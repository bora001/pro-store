"use client";
import useGetCountdown from "@/hooks/use-get-countdown";
import { Badge } from "../../ui/badge";
import { Clock } from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
const ProductDealTimerContent = dynamic(
  () => import("./product-deal-timer-content"),
  {
    loading: () => <></>,
    ssr: false,
  }
);
const ProductDealTimer = ({
  endTime,
  type = "limited",
  className,
  noRound,
  setIsActiveDeal,
}: {
  endTime: string;
  type?: string;
  className?: ClassValue;
  noRound?: boolean;
  setIsActiveDeal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const time = useGetCountdown(endTime, "array");
  const trimmedTime = useMemo(() => {
    const result = [...time];
    while (result.length > 2 && result[0] === "00") {
      result.shift();
    }
    return result;
  }, [time]);

  useEffect(() => {
    if (setIsActiveDeal) {
      setIsActiveDeal(time.length > 0);
    }
  }, [setIsActiveDeal, time.length]);

  return (
    <div
      className={cn("absolute", time.length ? "block" : "hidden", className)}
    >
      <Badge
        variant="destructive"
        className={cn(
          "py-1 flex items-center justify-center gap-1",
          noRound && "rounded-none"
        )}
      >
        <Clock size={16} />
        <p>{capitalize(type)}</p>
        <ProductDealTimerContent trimmedTime={trimmedTime} />
      </Badge>
    </div>
  );
};

export default ProductDealTimer;
