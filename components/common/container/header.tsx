import { ReactNode } from "react";

const Header = ({ children }: { children: ReactNode }) => {
  return <div className="flex justify-between items-center my-2 mb-4">{children}</div>;
};

export default Header;
