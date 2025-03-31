import { RefreshCcw } from "lucide-react";
import Link from "next/link";

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
            <RefreshCcw width={14} className="text-gray-400 cursor-pointer" />
          </Link>
        </div>
      )}
    </>
  );
};

export default FilterIndicator;
