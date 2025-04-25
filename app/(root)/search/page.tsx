import KeywordReset from "@/components/admin/search/keyword-reset";
import MainFilter from "@/components/admin/search/main-filter";
import SortFilter from "@/components/admin/search/sort-filter";
import ListContainer from "@/components/common/list-container";
import ProductCard from "@/components/home/product-card";
import { getAllProducts } from "@/lib/actions/admin.actions";
import { getAllCategory } from "@/lib/actions/product.actions";
import { CONSTANTS, PATH } from "@/lib/constants";

export type SearchPageParamsType = {
  query?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  page?: string;
};

export const metadata = {
  title: "Search",
};

const SearchPage = async (props: {
  params: Promise<{
    referer: string;
  }>;
  searchParams: Promise<SearchPageParamsType>;
}) => {
  const params = await props.searchParams;
  const {
    query = "",
    category = CONSTANTS.ALL,
    price = CONSTANTS.ALL,
    rating = CONSTANTS.ALL,
    sort = "newest",
    page = "1",
  } = params;

  const product = await getAllProducts({
    query,
    category,
    price,
    rating,
    sort,
    page: +page,
  });

  const computedHeight = `calc(100vh - ${CONSTANTS.HEADER_HEIGHT * 2 + 26}px)`;
  const allCategory = await getAllCategory();

  return (
    <div className=" h-full">
      <div
        className="flex-1 flex flex-col relative h-full"
        style={{ height: computedHeight }}
      >
        <div className="grid h-full sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
          <div className=" sm:relative absolute sm:col-span-2 md:col-span-2 lg:col-span-2 overflow-hidden">
            <MainFilter category={allCategory} />
          </div>
          <div className=" space-y-4 flex flex-col h-full p-3 sm:p-0 sm:col-span-3 md:col-span-5 lg:col-span-7 ">
            {/* search-keyword & sort */}
            <div className="flex justify-between shrink-0">
              <KeywordReset query={query} params={params} />
              <SortFilter sortBy={sort} />
            </div>
            {/* product-list */}
            <div
              className=" flex-1 overflow-hidden "
              style={{ position: "relative" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  overflowY: "auto",
                }}
              >
                <ListContainer
                  title="No product found"
                  href={PATH.HOME}
                  linkText="Back to home"
                  listLength={product.product.length}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
                    {product.product.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </ListContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
