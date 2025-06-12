import { useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { ResponseType } from "@/types";

export const AdminControlButton = ({
  title: [active, inactive],
  disabled,
  action,
}: {
  title: string[];
  disabled: boolean;
  action: () => Promise<ResponseType>;
}) => {
  const [isPending, startTransition] = useTransition();
  const onControl = () => {
    startTransition(async () => {
      const { success, message } = await action();
      toast({
        variant: success ? "default" : "destructive",
        description: message,
      });
    });
  };
  return (
    <Button
      disabled={isPending || disabled}
      onClick={onControl}
      variant="secondary"
    >
      {disabled ? inactive : active}
    </Button>
  );
};

export default AdminControlButton;
