import { ProductItem } from "@/db/sample-data";
import ProductCard from "./product-card";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: ProductItem[];
  title?: string;
  limit?: number;
}) => {
  const productData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="font-bold mb-4">{title}</h2>
      {productData.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productData.map((product) => (
            <ProductCard product={product} key={product.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
