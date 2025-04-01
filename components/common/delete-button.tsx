"use client";

import { ReactNode, useState, useTransition } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { ResponseType } from "@/types";
type DeleteButtonType = "button" | "badge" | "custom";
const DeleteButton = ({
  id,
  action,
  type,
  children,
}: {
  id: string;
  type: DeleteButtonType;
  action: (id: string) => Promise<ResponseType>;
  children?: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const onDelete = () => {
    startTransition(async () => {
      const { success, message } = await action(id);
      if (success) {
        setOpen(false);
        toast({ description: message });
      } else {
        toast({ variant: "destructive", description: message });
      }
    });
  };
  const DeleteTrigger = () => {
    if (type === "button") return <Button>Delete</Button>;
    if (type === "badge")
      return <Badge className="cursor-pointer">Delete</Badge>;
    if (type === "custom") return children;
  };
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* button */}
        <AlertDialogTrigger asChild>{DeleteTrigger()}</AlertDialogTrigger>
        {/* modal */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button disabled={isPending} onClick={onDelete}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteButton;
