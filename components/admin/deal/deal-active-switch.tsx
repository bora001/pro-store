"use client";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { updateDeal } from "@/lib/actions/admin/admin.deal.actions";
import { AdminDealType } from "@/types";
import { useState, useTransition } from "react";

const DealActiveSwitch = ({
  deal,
  activeStatus,
  isValidDate,
}: {
  deal: AdminDealType;
  activeStatus: boolean;
  isValidDate: boolean;
}) => {
  const [isActive, setActive] = useState(activeStatus);
  const [isPending, startTransition] = useTransition();

  const onActiveHandler = () => {
    if (!isValidDate && !activeStatus) {
      toast({
        variant: "destructive",
        title: "Invalid date",
        description: "Please select a valid date",
      });
      return;
    }
    startTransition(async () => {
      const { success, message } = await updateDeal({
        id: deal.id,
        isActive: !isActive,
      });

      if (success) {
        setActive((prev) => !prev);
      }
      toast({
        variant: success ? "default" : "destructive",
        description: message,
      });
    });
  };
  return (
    <Switch
      disabled={isPending}
      checked={isActive}
      onCheckedChange={onActiveHandler}
    />
  );
};

export default DealActiveSwitch;
