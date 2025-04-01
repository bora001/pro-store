import { Star } from "lucide-react";

const RatingStar = ({ rating }: { rating: number | string }) => {
  return (
    <div className="flex items-center">
      <Star className="mr-1 h-4 w-4" fill="gold" color="gold" />
      {rating}
    </div>
  );
};

export default RatingStar;
