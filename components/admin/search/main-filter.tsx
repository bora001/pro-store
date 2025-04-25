import { CategoryType } from "@/types";
import MainFilterContent from "./main-filter-content";
import MobileMainFilter from "./mobile-main-filter";

const MainFilter = ({ category }: { category: CategoryType[] }) => {
  return (
    <div>
      <div className="block sm:hidden ">
        <MobileMainFilter category={category} />
      </div>
      <div className="hidden sm:block">
        <MainFilterContent category={category} />
      </div>
    </div>
  );
};

export default MainFilter;
