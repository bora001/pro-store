import FilterIndicator from "@/components/admin/filter-indicator";
import Container from "@/components/common/container";
import SearchInput from "@/components/common/search-input";
import { ReactNode } from "react";

const SearchContainer = ({
  title,
  children,
  query,
  resetPath,
  hasList,
  emptyText,
  extraButton,
}: {
  title: string;
  resetPath: string;
  query: string;
  children: ReactNode;
  hasList: boolean;
  emptyText: string;
  extraButton?: ReactNode;
}) => {
  return (
    <Container
      title={title}
      extra={<FilterIndicator query={query} resetPath={resetPath} />}
      button={
        <div className="flex gap-2">
          <SearchInput />
          {extraButton}
        </div>
      }
    >
      {hasList ? (
        <div className="flex h-full w-full justify-center items-center">
          <p>{emptyText}</p>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-between">{children}</div>
      )}
    </Container>
  );
};

export default SearchContainer;
