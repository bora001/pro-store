"use client";
import useGetCountdown from "@/hooks/use-get-countdown";
import { Badge } from "../ui/badge";
import { Clock } from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Dispatch, SetStateAction, useEffect } from "react";

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
  const trimmedTime = [...time];
  while (trimmedTime.length > 2 && trimmedTime[0] === "00") {
    trimmedTime.shift();
  }
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
        <div className="flex gap-1">
          {trimmedTime.map((item, index) => (
            <div key={`${item}_${index}`} className={cn("flex gap-1")}>
              <span>{item}</span>
              <span
                className={`${index === trimmedTime.length - 1 ? "hidden" : "block"} `}
              >
                :
              </span>
            </div>
          ))}
        </div>
      </Badge>
    </div>
  );
};

export default ProductDealTimer;
