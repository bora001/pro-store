"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.action";
import { PATH } from "@/lib/constants";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const UserButtonBox = ({
  isAdmin,
  ...props
}: {
  isAdmin: boolean;
  childList?: { title: string; content: ReactNode }[];
} & ButtonProps) => {
  const ADMIN_BUTTON = isAdmin
    ? [{ action: () => redirect(PATH.DASHBOARD), title: "Admin" }]
    : [];
  const USER_BUTTON = [
    ...ADMIN_BUTTON,
    { action: () => redirect(PATH.MY_PROFILE), title: "My Profile" },
    { action: () => redirect(PATH.MY_ORDER), title: "My Order" },
    { action: signOutUser, title: "Sign Out" },
  ];
  return (
    <div className="space-y-1">
      {/* <SheetClose>dlc</SheetClose> */}
      {USER_BUTTON.map(({ action, title }) => (
        <div key={title}>
          <Button
            className="flex gap-3 justify-start w-full border-none"
            onClick={action}
            variant="secondary"
            {...props}
          >
            {title}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default UserButtonBox;
