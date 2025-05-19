"use client";

import { ReviewType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Pencil, Trash, User } from "lucide-react";
import dayjs from "dayjs";
import RatingStar from "../common/rating-star";
import IconButton from "../custom/icon-button";
import ReviewForm from "./review-form";
import DeleteButton from "../common/delete-button";
import { deleteReview } from "@/lib/actions/handler/review.actions";
import ListContainer from "../common/list-container";

type ReviewListPropsType = { productId: string; reviewList: ReviewType[]; currentUser?: string };
const ReviewList = ({ productId, reviewList, currentUser }: ReviewListPropsType) => {
  return (
    <div className="flex-1 flex flex-col gap-3">
      <ListContainer listLength={reviewList.length} title="No reviews yet">
        <div className="flex flex-col gap-3">
          {reviewList.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between min-h-12 items-center">
                  <CardTitle>{review.title}</CardTitle>
                  {currentUser === review.userId && (
                    <div className="flex ">
                      <ReviewForm
                        type="edit"
                        review={{
                          title: review.title,
                          description: review.description,
                          rating: +review.rating,
                        }}
                        userId={currentUser}
                        productId={productId}
                        button={<IconButton icon={<Pencil />} className="p-3" />}
                      />
                      <DeleteButton
                        type="custom"
                        id={review.id}
                        action={deleteReview}
                        buttonLabel="delete-review-button"
                      >
                        <IconButton icon={<Trash />} className="p-3" />
                      </DeleteButton>
                    </div>
                  )}
                </div>
                <CardDescription>{review.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground items-center">
                  {/* rating */}
                  <RatingStar rating={review.rating} />
                  {/* user */}
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    {review.user ? review.user?.name : "User"}
                  </div>
                  {/* date */}
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {dayjs(review.createdAt).format("MMM DD, YYYY")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ListContainer>
    </div>
  );
};

export default ReviewList;
