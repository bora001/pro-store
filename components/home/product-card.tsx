import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "./product-price";
import { ProductItem } from "@/types";

const ProductCard = ({
  product: { slug, images, name, brand, rating, stock, price },
}: {
  product: ProductItem;
}) => {
  return (
    <Card className="w-full max-w-sm">
      {/* header */}
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${slug}`}>
          <Image
            src={images[0]}
            alt={name}
            height={300}
            width={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      {/* content */}
      <CardContent className="p-4 grid gap-4">
        <p className="text-xs">{brand}</p>
        <Link href={`/product/${slug}`}>
          <h2 className="text-sm font-medium">{name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{rating} Stars</p>
          {stock > 0 ? <ProductPrice price={price} /> : <p>Out of Stock</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
