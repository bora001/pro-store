import { Trash2 } from "lucide-react";
import IconButton from "../custom/IconButton";
import { useTransition } from "react";
import { removeItemToCart } from "@/lib/actions/cart.actions";
import { CartItemType } from "@/types";
import { toast } from "@/hooks/use-toast";

const ItemRemoveButton = ({ item }: { item: CartItemType }) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteItem = () => {
    startTransition(async () => {
      try {
        const { message } = await removeItemToCart(item);
        toast({ variant: "destructive", description: message });
      } catch (error) {
        toast({
          description: error as string,
        });
      }
    });
  };
  return (
    <IconButton
      aria-label="item-remove-button"
      disabled={isPending}
      icon={<Trash2 width={15} />}
      onClick={() => handleDeleteItem()}
    />
  );
};

export default ItemRemoveButton;
