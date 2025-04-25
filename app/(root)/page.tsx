import DealCountDown from "@/components/home/deal-countdown";
import ProductList from "@/components/home/product-list";
import ShoppingBenefits from "@/components/home/shopping-benefits";
import ProductCarousel from "@/components/product/product-carousel";
import { Button } from "@/components/ui/button";
import { getDeal } from "@/lib/actions/admin.actions";
import {
  getFeatureProduct,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import { PATH } from "@/lib/constants";
import { autocomplete } from "@/lib/typesense/autoComplete";
import Link from "next/link";

const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  const featureProduct = await getFeatureProduct();
  const { data: deal } = await getDeal({ isActive: true });
  autocomplete("");

  return (
    <div className={"space-y-6 my-4"}>
      <ProductCarousel data={featureProduct} />
      <ShoppingBenefits />
      <DealCountDown deal={deal} />
      <ProductList
        data={latestProduct}
        title="Newest Arrivals"
        className={!latestProduct.length && "hidden"}
      />
      <div className="flex items-center justify-center mb-6">
        <Link href={PATH.SEARCH}>
          <Button>View All Products</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
