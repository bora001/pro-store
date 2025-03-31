import ProductList from "@/components/home/product-list";
import ProductCarousel from "@/components/product/product-carousel";
import { Button } from "@/components/ui/button";
import {
  getFeatureProduct,
  getLatestProducts,
} from "@/lib/actions/product.actions";
const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  const featureProduct = await getFeatureProduct();
  return (
    <>
      <ProductCarousel data={featureProduct} />
      <ProductList data={latestProduct} title="Newest Arrivals" />
      <Button>button</Button>
    </>
  );
};

export default HomePage;
