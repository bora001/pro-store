import ProductList from "@/components/home/product-list";
import { Button } from "@/components/ui/button";
import { getLatestProducts } from "@/lib/actions/product.actions";
const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProduct} title="Newest Arrivals" />
      <Button>button</Button>
    </>
  );
};

export default HomePage;
