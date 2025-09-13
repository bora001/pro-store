import { ReactNode } from "react";
import { Button, ButtonProps } from "../ui/button";
import Link from "next/link";
import { PATH } from "@/lib/constants";

const LinkButton = ({
  icon,
  title,
  url = PATH.HOME,
  ...props
}: {
  icon?: ReactNode;
  title: string;
  url: string;
} & ButtonProps) => {
  return (
    <Link href={url} className="flex gap-4 items-center">
      <Button {...props}>
        {icon}
        <p>{title}</p>
      </Button>
    </Link>
  );
};

export default LinkButton;
