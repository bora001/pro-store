"use client";

import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";
import { ReactNode } from "react";
interface ButtonWithTransitionProps extends ButtonProps {
  isPending: boolean;
  onClick?: () => void;
  title: string;
  pendingIcon?: ReactNode;
  leftIcon?: ReactNode;
}
const ButtonWithTransition = ({
  isPending,
  onClick,
  title,
  pendingIcon = <Loader2 className="animate-spin" />,
  leftIcon,
  ...props
}: ButtonWithTransitionProps) => {
  return (
    <Button className="w-full" onClick={onClick} disabled={isPending} {...props}>
      {/* extra left icon */}
      {leftIcon && (
        <>
          {isPending ? pendingIcon : leftIcon}
          {title}
        </>
      )}
      {/* text only */}
      {!leftIcon && (isPending ? pendingIcon : title)}
    </Button>
  );
};

export default ButtonWithTransition;
