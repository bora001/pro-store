"use client";

import useGetCountdown from "@/hooks/use-get-countdown";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
const DealCountdownTimer = ({
  endTime,
  isActiveDeal,
  setIsActiveDeal,
}: {
  endTime: string;
  isActiveDeal: boolean;
  setIsActiveDeal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const timeParts = useGetCountdown(endTime, "object");

  useEffect(() => {
    setIsMounted(true);
    if (setIsActiveDeal) {
      setIsActiveDeal(timeParts.length > 0);
    }
  }, [setIsActiveDeal, timeParts]);

  return (
    <div className="flex gap-4">
      {isActiveDeal &&
        timeParts.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="relative bg-black text-white text-4xl font-mono px-4 py-3 rounded-md shadow-inner w-20 border border-gray-700">
              {isMounted ? value : "--"}
            </div>
            <div className="text-xs mt-1 tracking-wider font-semibold uppercase">
              {label}
            </div>
          </div>
        ))}
    </div>
  );
};

export default DealCountdownTimer;
