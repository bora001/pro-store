import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ReactNode } from "react";

const Container = ({
  title,
  extra,
  button,
  children,
  className,
}: {
  title: string;
  extra?: string | ReactNode;
  button?: ReactNode;
  children: ReactNode;
  className?: ClassValue;
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center my-2 mb-4">
        <div className="flex items-end gap-3">
          <h2 className="h2-bold">{title}</h2>
          {extra}
        </div>
        {button}
      </div>
      <div className={cn("h-full", className)}>{children}</div>
    </div>
  );
};

export default Container;
