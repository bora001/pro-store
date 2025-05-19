import FilterIndicator from "@/components/admin/filter-indicator";
import SearchInput from "@/components/common/search-input";
import { ReactNode } from "react";
import EmptyBox from "../../../common/empty-box";
import Container from "@/components/common/container";

const SearchContainer = ({
  title,
  children,
  query,
  resetPath,
  noList,
  emptyText,
  extraButton,
}: {
  title: string;
  resetPath: string;
  query: string;
  children: ReactNode;
  noList: boolean;
  emptyText: string;
  extraButton?: ReactNode;
}) => {
  return (
    <Container>
      <Container.Header>
        <Container.HeaderLeft>
          <Container.Title title={title} />
          <FilterIndicator query={query} resetPath={resetPath} />
        </Container.HeaderLeft>
        <div className="flex gap-2">
          <SearchInput />
          {extraButton}
        </div>
      </Container.Header>
      <Container.Body>
        {noList ? (
          <EmptyBox title={emptyText} />
        ) : (
          <div className="h-full flex flex-col justify-between">{children}</div>
        )}
      </Container.Body>
    </Container>
  );
};

export default SearchContainer;
