import ProductList from "@/components/home/product-list";
import { Button } from "@/components/ui/button";
import sampleData from "@/db/sample-data";
const HomePage = async () => {
  return (
    <>
      <ProductList
        data={sampleData.products}
        title="Newest Arrivals"
        limit={4}
      />
      <Button>button</Button>
    </>
  );
};

export default HomePage;
