import { ReactNode } from "react";

const SubContainer = ({
  title,
  children,
  buttons,
}: {
  title: string;
  children: ReactNode;
  buttons?: ReactNode;
}) => (
  <div className="flex flex-col gap-3 flex-1">
    <div className="flex justify-between items-center">
      <h3 className="text-lg">{title}</h3>
      {buttons}
    </div>
    {children}
  </div>
);

export default SubContainer;
