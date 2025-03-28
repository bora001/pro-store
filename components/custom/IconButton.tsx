import { ReactNode } from "react";
import { Button, ButtonProps } from "../ui/button";

interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
}
const IconButton = ({
  className,
  icon,
  variant = "ghost",
  onClick,
}: IconButtonProps) => {
  return (
    <Button variant={variant} className={className} onClick={onClick}>
      {icon}
    </Button>
  );
};

export default IconButton;
