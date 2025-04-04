"use client";

import { ReactNode, useState, useTransition } from "react";
import { Badge } from "../ui/badge";
import { Button, ButtonProps } from "../ui/button";
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
import { redirect } from "next/navigation";

type DeleteButtonType = "button" | "badge" | "custom";

type DeleteButtonButtonProps = Omit<ButtonProps, "type">;

interface DeleteButtonPropsBase {
  id: string;
  type: DeleteButtonType;
  action: (id: string) => Promise<ResponseType>;
  children?: ReactNode;
  returnPath?: string;
}
type DeleteButtonPropsType =
  | (DeleteButtonPropsBase & { type: "button" } & DeleteButtonButtonProps)
  | DeleteButtonPropsBase;

const DeleteButton = ({
  id,
  action,
  type,
  children,
  returnPath,
  ...props
}: DeleteButtonPropsType) => {
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
    if (returnPath) redirect(returnPath);
  };
  const DELETE_TRIGGER = {
    button: <Button {...props}>Delete</Button>,
    badge: <Badge className="cursor-pointer">Delete</Badge>,
    custom: children,
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* button */}
        <AlertDialogTrigger asChild>{DELETE_TRIGGER[type]}</AlertDialogTrigger>
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
