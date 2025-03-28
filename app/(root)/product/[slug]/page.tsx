import ProductImages from "@/components/home/product-images";
import ProductPrice from "@/components/home/product-price";
import AddToCart from "@/components/product/add-to-cart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Product",
};
const ProductDetailPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const {
    category,
    brand,
    name,
    rating,
    numReviews,
    price,
    description,
    stock,
    images,
    id,
  } = product;
  const inStock = stock > 0;

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* image */}
        <div className="col-span-2">
          <ProductImages images={images} name={name} />
        </div>
        {/* detail */}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {brand} {category}
            </p>
            <h1 className="h3-bold">{name}</h1>
            <p>
              {rating} of {numReviews} Reviews
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <ProductPrice
                price={price}
                className="w-24 roud-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{description}</p>
            </div>
          </div>
        </div>
        {/* action */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <ProductPrice price={price} />
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <Badge variant={inStock ? "outline" : "destructive"}>
                {inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            {inStock && (
              <div className="flex-center">
                <AddToCart
                  item={{
                    productId: id,
                    name,
                    slug,
                    price,
                    qty: 1,
                    image: images[0],
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductDetailPage;
