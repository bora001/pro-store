"use client";

import useGetCountdown from "@/hooks/use-get-countdown";
import useIsMounted from "@/hooks/use-is-mounted";
import { Dispatch, SetStateAction, useEffect } from "react";

type DealCountdownTimerPropsType = {
  endTime: string;
  isActiveDeal: boolean;
  setIsActiveDeal?: Dispatch<SetStateAction<boolean>>;
};

const DealCountdownTimer = ({ endTime, isActiveDeal, setIsActiveDeal }: DealCountdownTimerPropsType) => {
  const { time: timeParts, isEnded } = useGetCountdown(endTime, "object");
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted && setIsActiveDeal) {
      setIsActiveDeal(!isEnded);
    }
  }, [isMounted, setIsActiveDeal, isEnded]);
  return (
    <div className="flex gap-4">
      {isActiveDeal &&
        timeParts.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="relative bg-black text-white text-4xl font-mono px-4 py-3 rounded-md shadow-inner w-20 border border-gray-700">
              {isMounted ? value : "--"}
            </div>
            <div className="text-xs mt-1 tracking-wider font-semibold uppercase">{label}</div>
          </div>
        ))}
    </div>
  );
};

export default DealCountdownTimer;
