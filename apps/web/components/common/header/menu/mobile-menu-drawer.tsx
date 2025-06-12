import CartIconButton from "../buttons/cart-icon-button";
import ThemeToggleItem from "../theme-toggle/theme-toggle-item";
import UserButton from "../user-button/user-button";

const MobileMenuDrawer = () => {
  return (
    <div className="flex flex-col gap-4 ">
      <CartIconButton variant="default" className="w-full" />
      <div className="w-full">
        <UserButton noPopup />
      </div>
      <div className="space-y-2 border p-4 rounded-2xl">
        <h3 className="font-bold">Appearance</h3>
        <div className="flex flex-col">
          <ThemeToggleItem {...{ noPopup: true }} />
        </div>
      </div>
    </div>
  );
};

export default MobileMenuDrawer;
