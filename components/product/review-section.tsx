import { PenLine } from "lucide-react";
import ReviewForm from "./review-form";
import Link from "next/link";
import { PATH } from "@/lib/constants";
import ReviewList from "./review-list";
import { getAllReviews, hasPurchaseHistory, hasUserReviewByProduct } from "@/lib/actions/handler/review.actions";
import { auth } from "@/auth";
import IconButton from "../custom/icon-button";

const ReviewSection = async ({ productId, slug }: { productId: string; slug: string }) => {
  const { data: reviews } = await getAllReviews(productId);
  const wroteReview = await hasUserReviewByProduct(productId);
  const session = await auth();
  const userId = session?.user.id;
  const { success: purchaseHistory } = await hasPurchaseHistory(productId);

  const writeReview = (
    <div className={wroteReview.data || !purchaseHistory ? "hidden" : "block"}>
      <ReviewForm
        userId={userId}
        productId={productId}
        button={<IconButton variant="default" icon={<PenLine />} text="Write a Review" />}
      />
    </div>
  );

  const writeReviewBeforeSignIn = (
    <p className="w-fit">
      Please
      <Link href={`${PATH.SIGN_IN}?callbackUrl=${PATH.PRODUCT}/${slug}`} className="text-blue-600 mx-1 underline">
        sign in
      </Link>
      to write a review
    </p>
  );

  return (
    <section className="flex-1 flex flex-col">
      <div className="flex justify-between py-4">
        <h2 className="h2-bold">Customer Reviews</h2>
        {userId ? writeReview : writeReviewBeforeSignIn}
      </div>
      <ReviewList productId={productId} reviewList={reviews || []} currentUser={userId} />
    </section>
  );
};

export default ReviewSection;
