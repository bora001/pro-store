import useGetCountdown from "@/hooks/use-get-countdown";
import Text from "../custom/Text";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect } from "react";

const OriginalPrice = ({
  endTime,
  price,
  setIsActiveDeal,
}: {
  endTime: string;
  price: string;
  setIsActiveDeal: Dispatch<SetStateAction<boolean>>;
}) => {
  const time = useGetCountdown(endTime || "", "array");
  useEffect(() => {
    if (!time.length) {
      setIsActiveDeal(false);
    }
  }, [setIsActiveDeal, time]);

  return (
    <div
      className={cn(
        "text-xl leading-[1] items-center",
        "line-through text-gray-500",
        time.length ? "flex" : "hidden"
      )}
    >
      <Text size="xs" className="mr-1">
        {price}
      </Text>
    </div>
  );
};

export default OriginalPrice;
