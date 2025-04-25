import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FilterIcon } from "lucide-react";
import MainFilterContent from "./main-filter-content";
import { CategoryType } from "@/types";
import { Button } from "@/components/ui/button";

const MobileMainFilter = ({ category }: { category: CategoryType[] }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="px-3 flex items-center"
          aria-label="category-drawer"
        >
          <FilterIcon />
          Filter
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[480px]">
        <DrawerHeader>
          <DrawerDescription className="text-[0px]">
            Open filters to refine search results
          </DrawerDescription>
          <DrawerTitle className="mb-4" />
          <MainFilterContent category={category} />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMainFilter;
