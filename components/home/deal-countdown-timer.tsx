"use client";

import useGetCountdown from "@/hooks/use-get-countdown";
import { Dispatch, SetStateAction, useEffect } from "react";
const DealCountdownTimer = ({
  endTime,
  setIsActiveDeal,
}: {
  endTime: string;
  setIsActiveDeal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const timeParts = useGetCountdown(endTime, "object");
  useEffect(() => {
    if (setIsActiveDeal) {
      setIsActiveDeal(timeParts.length > 0);
    }
  }, [setIsActiveDeal, timeParts.length]);

  return (
    <div className="flex gap-4">
      {timeParts.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="relative bg-black text-white text-4xl font-mono px-4 py-3 rounded-md shadow-inner w-20 border border-gray-700">
            {value}
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
