"use client";

import { calculateTime } from "@/lib/utils";
import { useEffect, useState } from "react";
type CountdownType = "array" | "object";
type CountdownObject = { label: string; value: string }[];
type CountdownArray = string[];

type CountdownResult<T extends CountdownType> = {
  array: CountdownArray;
  object: CountdownObject;
}[T];

function useGetCountdown<T extends CountdownType>(
  endTime: string,
  type: T = "object" as T
): CountdownResult<T> {
  const [timeLeft, setTimeLeft] = useState(() => calculateTime(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) return [] as CountdownResult<T>;

  const { days, hours, minutes, seconds } = timeLeft;

  const timeArray =
    [days, hours, minutes, seconds].map((time) =>
      String(time).padStart(2, "0")
    ) || [];
  if (type === "array") return timeArray as CountdownResult<T>;

  const timeObj =
    ["DAYS", "HRS", "MINS", "SECS"].map((label, index) => ({
      label,
      value: timeArray[index],
    })) || {};
  return timeObj as CountdownResult<T>;
}

export default useGetCountdown;
