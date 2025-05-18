"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmClock } from "lucide-react";
import { GetDealType } from "@/types";
import { cn } from "@/lib/utils";
import DealCountdownContent from "./deal-countdown-content";

const DealCountDown = ({ deal }: { deal?: GetDealType }) => {
  if (!deal) return <></>;
  return (
    <Card className={cn("w-full mx-auto py-4 rounded-lg shadow-lg relative bg-yellow-400", "dark:text-black")}>
      <CardHeader>
        <CardTitle className="text-3xl flex justify-center items-center gap-4">
          <AlarmClock size={30} className="animate-[shake_0.15s_ease-in-out_4s_infinite]" />
          <p>{deal.title}</p>
        </CardTitle>
      </CardHeader>
      <div className="my-3">
        <DealCountdownContent deal={deal} soldOut={deal.product?.stock === 0} />
      </div>
    </Card>
  );
};

export default DealCountDown;
