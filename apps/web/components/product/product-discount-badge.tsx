"use client";
import useGetCountdown from "@/hooks/use-get-countdown";
import ProductBadge from "../common/product-badge";

const ProductDiscountBadge = ({ discount, endTime }: { discount: number; endTime: string }) => {
  const { isEnded } = useGetCountdown(endTime || "", "array");

  return <ProductBadge text={`${discount}%`} className={discount && !isEnded ? "flex" : "hidden"} />;
};

export default ProductDiscountBadge;
