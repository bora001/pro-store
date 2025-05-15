import DealCountDown from "@/components/home/deal-countdown/deal-countdown";
import FeatureBannerSlide from "@/components/home/feature-banner-slide";
import ProductList from "@/components/home/product-list";
import ShoppingBenefits from "@/components/home/shopping-benefits";
import { Button } from "@/components/ui/button";
import { getActiveDeal } from "@/lib/actions/admin/admin.deal.actions";
import { getBanner } from "@/lib/actions/home.actions";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { PATH } from "@/lib/constants";
import { restartTypeSense } from "@/lib/typesense/restart-typesense";
import Link from "next/link";

const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  const bannerData = await getBanner();
  const { data: deal } = await getActiveDeal({ isActive: true });
  restartTypeSense();

  return (
    <div className={"space-y-6 my-4"}>
      <FeatureBannerSlide data={bannerData} />
      <ShoppingBenefits />
      <DealCountDown deal={deal} />
      <ProductList
        data={latestProduct}
        title="Newest Arrivals"
        className={!latestProduct.length && "hidden"}
      />
      <div className="flex items-center justify-center mb-6">
        <Link href={PATH.SEARCH}>
          <Button>View All Products</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
