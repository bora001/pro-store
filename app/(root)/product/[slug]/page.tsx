import { auth } from "@/auth";
import RatingStar from "@/components/common/rating-star";
import ProductImages from "@/components/home/product-images";
import ProductPrice from "@/components/home/product-price";
import AddToCart from "@/components/product/add-to-cart";
import ReviewForm from "@/components/product/review-form";
import ReviewList from "@/components/product/review-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import {
  getAllReviews,
  hasUserReviewByProduct,
} from "@/lib/actions/review.actions";
import { PATH } from "@/lib/constants";
import { MessageSquareText, PenLine } from "lucide-react";
import Link from "next/link";
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
  const session = await auth();
  const reviews = await getAllReviews(id);
  const wroteReview = await hasUserReviewByProduct(id);
  return (
    <div className=" flex flex-col h-full">
      {/* product */}
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
              <div className="flex justify-between">
                <RatingStar rating={rating} />
                <div className="flex items-center">
                  <MessageSquareText className="mr-1 h-4 w-4" />
                  {numReviews} reviews
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  price={price}
                  className="rounded-full bg-green-100 text-green-700 px-4 py-2"
                />
              </div>
              <p>{description}</p>
            </div>
          </div>
          {/* action */}
          <Card className="max-h-min">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between">
                <div>Price</div>
                <ProductPrice price={price} />
              </div>
              <div className="flex justify-between">
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
      {/* review */}
      <section className="flex-1 flex flex-col">
        <div className="flex justify-between py-4">
          <h2 className="h2-bold">Customer Reviews</h2>
          {session?.user.id ? (
            <div className={wroteReview.data ? "hidden" : "block"}>
              <ReviewForm
                userId={session?.user.id}
                productId={id}
                button={
                  <Button>
                    <PenLine />
                    Write a Review
                  </Button>
                }
              />
            </div>
          ) : (
            <p className="w-fit">
              Please
              <Link
                href={`${PATH.SIGN_IN}?callbackUrl=${PATH.PRODUCT}/${slug}`}
                className="text-blue-600 mx-1 underline"
              >
                sign in
              </Link>
              to write a review
            </p>
          )}
        </div>
        <ReviewList
          productId={id}
          reviewList={reviews.data}
          currentUser={session?.user.id}
        />
      </section>
    </div>
  );
};

export default ProductDetailPage;
