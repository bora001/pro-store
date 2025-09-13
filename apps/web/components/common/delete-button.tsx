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
import { useRouter } from "next/navigation";
import { ResponseType } from "../../types";

type DeleteButtonType = "button" | "badge" | "custom";

type DeleteButtonButtonProps = Omit<ButtonProps, "type">;

interface DeleteButtonPropsBase<T = unknown> {
  id: string;
  type: DeleteButtonType;
  action: (id: string) => Promise<ResponseType<T>>;
  children?: ReactNode;
  returnPath?: string;
  buttonLabel: string;
  title?: string;
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
  buttonLabel,
  title,
  ...props
}: DeleteButtonPropsType) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const onDelete = () => {
    startTransition(async () => {
      const { success, message } = await action(id);
      if (success) {
        setOpen(false);
        toast({ description: message });
        if (returnPath) router.push(returnPath);
      } else {
        toast({ variant: "destructive", description: message });
      }
    });
  };
  const DELETE_TRIGGER = {
    button: <Button {...props}>{title || "Delete"}</Button>,
    badge: <Badge className="cursor-pointer">{title || "Delete"}</Badge>,
    custom: children,
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* button */}
        <AlertDialogTrigger asChild aria-label={buttonLabel}>
          {DELETE_TRIGGER[type]}
        </AlertDialogTrigger>
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
