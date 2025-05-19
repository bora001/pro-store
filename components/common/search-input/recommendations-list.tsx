import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
type RecommendationListPropsType = {
  activeIndex: number | null;
  recommendations: string[];
  getRecommendation: (value: string) => void;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
};
const RecommendationList = ({
  activeIndex,
  recommendations,
  getRecommendation,
  setActiveIndex,
}: RecommendationListPropsType) => {
  return (
    <div
      tabIndex={0}
      className={
        "w-80 text-sm absolute bg-white py-3 mt-3 rounded-sm shadow-lg max-h-52 overflow-y-scroll dark:bg-black"
      }
      onMouseOver={() => setActiveIndex(null)}
    >
      {recommendations.map((item, idx) => (
        <div
          key={item}
          role="option"
          aria-selected={activeIndex === idx}
          className={cn(
            "px-4 py-2 cursor-pointer",
            activeIndex === idx
              ? [STYLE.OPTION_FOCUS_BG, STYLE.OPTION_FOCUS_FONT]
              : [`hover:${STYLE.OPTION_FOCUS_BG}`, `hover:${STYLE.OPTION_FOCUS_FONT}`]
          )}
          onClick={() => getRecommendation(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default RecommendationList;

const STYLE = {
  OPTION_FOCUS_BG: "bg-gray-100",
  OPTION_FOCUS_FONT: "font-semibold",
};
