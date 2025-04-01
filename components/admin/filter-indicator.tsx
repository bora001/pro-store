import Link from "next/link";
import ResetIcon from "../common/reset-icon";

const FilterIndicator = ({
  query,
  resetPath,
}: {
  query: string;
  resetPath: string;
}) => {
  return (
    <>
      {query && (
        <div className="flex gap-2">
          <span>
            Filter by <i>{query}</i>
          </span>
          <Link href={resetPath}>
            <ResetIcon />
          </Link>
        </div>
      )}
    </>
  );
};

export default FilterIndicator;
