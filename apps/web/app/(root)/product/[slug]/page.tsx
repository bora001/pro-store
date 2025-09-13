import ProductSection from "@/components/product/product-section";
import ReviewSection from "@/components/product/review-section";
import { getProductBySlug } from "@/lib/actions/handler/product.actions";

import { notFound } from "next/navigation";
export const metadata = {
  title: "Product",
};
const ProductDetailPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const { data: product } = await getProductBySlug(slug);
  if (!product) notFound();
  return (
    <div className=" flex flex-col h-full">
      {/* product */}
      <ProductSection product={product} />
      {/* review */}
      <ReviewSection productId={product.id} slug={slug} />
    </div>
  );
};

export default ProductDetailPage;
