"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmClock } from "lucide-react";
import { addDealType } from "@/types";
import { cn } from "@/lib/utils";
import DealCountdownContent from "./deal-countdown-content";

const DealCountDown = ({ deal }: { deal?: addDealType }) => {
  if (!deal) return <></>;
  const soldOut = deal.product?.stock === 0;
  const isEnd = deal.endTime ? new Date(deal.endTime) < new Date() : false;
  return (
    <Card
      className={cn(
        "w-full mx-auto py-4 rounded-lg shadow-lg relative",
        soldOut || isEnd ? " bg-yellow-300" : " bg-yellow-400"
      )}
    >
      <CardHeader>
        <CardTitle className="text-3xl flex justify-center items-center gap-4">
          <AlarmClock
            size={30}
            className="animate-[shake_0.15s_ease-in-out_4s_infinite]"
          />
          <p>{deal.title}</p>
        </CardTitle>
      </CardHeader>
      <DealCountdownContent deal={deal} soldOut={soldOut} isEnd={isEnd} />
    </Card>
  );
};

export default DealCountDown;
