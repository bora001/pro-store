import ProductList from "@/components/home/product-list";
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
    <>
      <ProductCarousel data={featureProduct} />
      <ProductList data={latestProduct} title="Newest Arrivals" />
      <div className="flex items-center justify-center mb-6">
        <Link href={PATH.SEARCH}>
          <Button>View All Products</Button>
        </Link>
      </div>
    </>
  );
};

export default HomePage;
