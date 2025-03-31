import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategory } from "@/lib/actions/product.actions";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
  const category = await getAllCategory();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" className="px-3">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle className="mb-4">Select a category</DrawerTitle>
          <div className="space-y-1">
            {category.map(({ category, _count }) => (
              <Button
                variant="ghost"
                key={category}
                className="w-full justify-start"
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${category}`}>
                    {category} <span className="text-gray-500">({_count})</span>
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
