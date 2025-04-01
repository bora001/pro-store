import KeywordReset from "@/components/admin/search/keyword-reset";
import MainFilter from "@/components/admin/search/main-filter";
import SortFilter from "@/components/admin/search/sort-filter";
import ProductCard from "@/components/home/product-card";
import { getAllProducts } from "@/lib/actions/admin.actions";
import { getAllCategory } from "@/lib/actions/product.actions";
import { CONSTANTS } from "@/lib/constants";

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

  const allCategory = await getAllCategory();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <MainFilter category={allCategory} />
      </div>
      <div className="md:col-span-4 space-y-4">
        {/* search-keyword & sort */}
        <div className="flex justify-between">
          <KeywordReset query={query} params={params} />
          <SortFilter sortBy={sort} />
        </div>
        {/* product-list */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {product.product.length === 0 ? (
            <>no product found</>
          ) : (
            product.product.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
