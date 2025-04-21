import { MessageSquareText } from "lucide-react";
import RatingStar from "../common/rating-star";
import ProductImages from "../home/product-images";
import ProductPrice from "../home/product-price";
import { Card, CardContent } from "../ui/card";
import AddToCart from "./add-to-cart";
import { Badge } from "../ui/badge";
import { ProductItemType } from "@/types";
import ProductDealTimer from "./product-deal-timer/product-deal-timer";

const ProductSection = ({ product }: { product: ProductItemType }) => {
  const { brand, name, price, images, id, slug, Deal } = product;
  const inStock = product.stock > 0;
  const cartProps = {
    productId: id,
    name,
    slug,
    price,
    qty: 1,
    image: images[0],
  };
  const isDeal = Deal.length > 0;
  const endTime = String(Deal[0]?.endTime || "");
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* image */}
        <div className="col-span-2 relative">
          <ProductDealTimer
            isActiveDeal={isDeal}
            endTime={endTime}
            type={Deal[0]?.type}
          />
          <ProductImages images={images} name={name} />
        </div>
        {/* detail : brand + category + name + rating + review + price + description */}
        <div className="col-span-2 p-5 flex flex-col gap-6">
          {/*  brand + category + name */}
          <p>{`${brand} ${product.category}`}</p>
          <h1 className="h3-bold">{name}</h1>
          {/* rating + review */}
          <div className="flex justify-between">
            <RatingStar rating={product.rating} />
            <div className="flex items-center">
              <MessageSquareText className="mr-1 h-4 w-4" />
              {product.numReviews} reviews
            </div>
          </div>
          {/* price */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <ProductPrice
              discount={Deal[0]?.discount}
              endTime={endTime}
              price={price}
              className="rounded-full bg-green-100 text-green-700 px-4 py-2"
            />
          </div>
          {/* description */}
          <p>{product.description}</p>
        </div>
        {/* action to cart */}
        <Card className="max-h-min">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between">
              <div>Price</div>
              <ProductPrice
                discount={Deal[0]?.discount}
                endTime={String(Deal[0]?.endTime || "")}
                price={price}
              />
            </div>
            <div className="flex justify-between">
              <div>Status</div>
              <Badge
                variant={inStock ? "outline" : "destructive"}
                data-testid="product-status"
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            {inStock && <AddToCart item={cartProps} />}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductSection;
