"use client";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.action";
import { PATH } from "@/lib/constants";
import { redirect } from "next/navigation";

const UserButtonBox = () => {
  const USER_BUTTON = [
    { action: () => redirect(PATH.MY_PROFILE), title: "My Profile" },
    { action: () => redirect(PATH.MY_ORDER), title: "My Order" },
    { action: signOutUser, title: "Sign Out" },
  ];
  return (
    <div className="space-y-1">
      {USER_BUTTON.map(({ action, title }) => (
        <Button
          key={title}
          className="flex gap-3 justify-start w-full "
          onClick={action}
          variant="outline"
        >
          {title}
        </Button>
      ))}
    </div>
  );
};

export default UserButtonBox;
