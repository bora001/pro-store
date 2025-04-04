import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import ProductPrice from "./product-price";
import { ProductItemType } from "@/types";
import { PATH } from "@/lib/constants";
import RatingStar from "../common/rating-star";
import { Badge } from "../ui/badge";
import S3Image from "../common/S3Image";

const PRODUCT_CARD_IMAGE_SIZE = 306;

const ProductCard = ({
  product: { slug, images, name, brand, rating, stock, price },
}: {
  product: ProductItemType;
}) => {
  return (
    <Card className="w-full max-w-sm">
      {/* header */}
      <CardHeader className="items-center p-0">
        <Link href={`${PATH.PRODUCT}/${slug}`}>
          <S3Image
            folder="product"
            fileName={String(images[0])}
            alt={name}
            size={PRODUCT_CARD_IMAGE_SIZE}
          />
        </Link>
      </CardHeader>
      {/* content */}
      <CardContent className="p-4 grid gap-4">
        <p className="text-xs">{brand}</p>
        <Link href={`${PATH.PRODUCT}/${slug}`}>
          <h2 className="text-sm font-medium line-clamp-2 h-[38px]">{name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <RatingStar rating={rating} />
          {stock > 0 ? (
            <ProductPrice price={price} />
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
