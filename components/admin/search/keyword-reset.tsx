import { SearchPageParamsType } from "@/app/(root)/search/page";
import ResetIcon from "@/components/common/reset-icon";
import { CONSTANTS, PATH } from "@/lib/constants";
import Link from "next/link";

const KeywordReset = ({
  query,
  params,
}: {
  query?: string;
  params: SearchPageParamsType;
}) => {
  const noQueryURL = query ? new URLSearchParams(params) : "";
  if (noQueryURL) noQueryURL.delete("query");
  return (
    <div>
      {query && (
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center ">
            {query !== CONSTANTS.ALL && query.length > 0 && (
              <div className="flex gap-2">
                <p>
                  Keyword : <i className="underline">{query}</i>
                </p>
                <Link href={`${PATH.SEARCH}?${noQueryURL.toString()}`}>
                  <ResetIcon />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordReset;
