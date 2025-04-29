import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategory } from "@/lib/actions/product.actions";
import { PATH } from "@/lib/constants";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
  const category = await getAllCategory();
  return (
    <>
      {category.length > 0 && (
        <Drawer direction="left">
          <DrawerDescription className="sr-only">
            Open filters to refine your search by category
          </DrawerDescription>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="px-3"
              aria-label="category-drawer"
            >
              <MenuIcon />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="mb-4">Select a category</DrawerTitle>
              <div className="space-y-1">
                {category.map(({ category, count }) => (
                  <Button
                    variant="ghost"
                    key={category}
                    className="w-full justify-start"
                    asChild
                  >
                    <DrawerClose asChild>
                      <Link href={`${PATH.SEARCH}?category=${category}`}>
                        {category}{" "}
                        <span className="text-gray-500">({count})</span>
                      </Link>
                    </DrawerClose>
                  </Button>
                ))}
              </div>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default CategoryDrawer;
