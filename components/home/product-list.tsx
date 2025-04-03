import { ProductItemType } from "@/types";
import ProductCard from "./product-card";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import ListContainer from "../common/list-container";

const ProductList = ({
  data,
  title,
  limit,
  className,
}: {
  data: ProductItemType[];
  title?: string;
  limit?: number;
  className?: ClassValue;
}) => {
  const productData = limit ? data.slice(0, limit) : data;
  return (
    <div className={cn(className, "my-10")}>
      <h2 className="h2-bold mb-4">{title}</h2>
      <ListContainer listLength={productData.length} title="No products found">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productData.map((product) => (
            <ProductCard product={product} key={product.name} />
          ))}
        </div>
      </ListContainer>
    </div>
  );
};

export default ProductList;
