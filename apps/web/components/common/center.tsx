import { ReactNode } from "react";

const Center = ({
  children,
  className,
  isFull,
}: {
  children: ReactNode;
  className?: string;
  isFull?: boolean;
}) => {
  return (
    <div
      className={`flex justify-center items-center ${className} ${isFull && "h-screen w-screen"}`}
    >
      {children}
    </div>
  );
};

export default Center;
