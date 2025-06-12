import { ReactNode } from "react";
import Body from "./body";
import Header from "./header";
import Title from "./title";
import HeaderLeft from "./header.left";

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="h-full flex flex-col">{children}</div>;
};

export default Object.assign(Container, {
  Body,
  Header,
  Title,
  HeaderLeft,
});
