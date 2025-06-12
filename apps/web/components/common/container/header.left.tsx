import { ReactNode } from "react";

const HeaderLeft = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-end gap-3">{children}</div>;
};

export default HeaderLeft;
