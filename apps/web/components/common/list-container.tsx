import { ReactNode } from "react";
import EmptyBox, { EmptyBoxPropsType } from "./empty-box";
interface ListContainerPropsType extends EmptyBoxPropsType {
  listLength: number;
  children: ReactNode;
}
const ListContainer = ({
  listLength,
  title,
  href,
  linkText,
  children,
}: ListContainerPropsType) => {
  return (
    <>
      {listLength > 0 ? (
        <>{children}</>
      ) : (
        <EmptyBox {...{ title, href, linkText }} />
      )}
    </>
  );
};

export default ListContainer;
