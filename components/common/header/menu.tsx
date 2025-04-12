import LinkButton from "@/components/custom/LinkButton";
import Flex from "../flex";
import ThemeToggle from "./theme-toggle";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";
import { PATH } from "@/lib/constants";

const MenuContent = (
  <>
    <ThemeToggle />
    <LinkButton
      {...{ variant: "ghost" }}
      icon={<ShoppingCart />}
      title="Cart"
      url={PATH.CART}
    />
    <UserButton />
  </>
);

const Menu = () => {
  return (
    <Flex>
      <nav className="hidden md:flex w-full max-w-xs gap-1">{MenuContent}</nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger
            className="align-middle"
            aria-label="mobile-menu-button"
          >
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            {MenuContent}
          </SheetContent>
        </Sheet>
      </nav>
    </Flex>
  );
};

export default Menu;
