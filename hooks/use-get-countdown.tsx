"use client";

import { calculateTime } from "@/lib/utils";
import { useEffect, useState } from "react";
type CountdownType = "array" | "object";
type CountdownObject = { label: string; value: string }[];
type CountdownArray = string[];

type CountdownResult<T extends CountdownType> = {
  time: { array: CountdownArray; object: CountdownObject }[T];
  isEnded: boolean;
};

const INITIAL_TIME = { days: 0, hours: 0, minutes: 0, seconds: 0 };
function useGetCountdown<T extends CountdownType>(endTime: string, type: T = "object" as T): CountdownResult<T> {
  const [timeLeft, setTimeLeft] = useState(() => calculateTime(endTime) || INITIAL_TIME);
  useEffect(() => {
    if (!timeLeft || Object.values(timeLeft).every((key) => !key)) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTime(endTime) || INITIAL_TIME);
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, timeLeft]);

  if (!timeLeft || Object.values(timeLeft).every((key) => !key))
    return { time: [], isEnded: true } as CountdownResult<T>;

  const { days, hours, minutes, seconds } = timeLeft;

  const timeArray = [days, hours, minutes, seconds].map((time) => String(time).padStart(2, "0")) || [];
  if (type === "array") return { time: timeArray, isEnded: false } as CountdownResult<T>;

  const timeObj = ["DAYS", "HRS", "MINS", "SECS"].map((label, index) => ({ label, value: timeArray[index] }));
  return { time: timeObj, isEnded: false } as CountdownResult<T>;
}

export default useGetCountdown;
