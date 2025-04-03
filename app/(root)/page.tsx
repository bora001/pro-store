import ProductList from "@/components/home/product-list";
import ShoppingBenefits from "@/components/home/shopping-benefits";
import ProductCarousel from "@/components/product/product-carousel";
import { Button } from "@/components/ui/button";
import {
  getFeatureProduct,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import { PATH } from "@/lib/constants";
import Link from "next/link";
const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  const featureProduct = await getFeatureProduct();
  return (
    <div className="space-y-3">
      <ProductCarousel data={featureProduct} />
      <ShoppingBenefits />
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
