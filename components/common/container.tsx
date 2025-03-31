import { ReactNode } from "react";

const Container = ({
  title,
  button,
  children,
}: {
  title: string;
  button?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center my-2 mb-4">
        <h2 className="h2-bold ">{title}</h2>
        {button}
      </div>
      {children}
    </div>
  );
};

export default Container;
