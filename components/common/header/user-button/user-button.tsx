import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CONSTANTS } from "@/lib/constants";
import { User } from "lucide-react";
import UserButtonBox from "./user-buttons-box";
import SignInButton from "../buttons/sign-in-button";

const UserButton = async ({ noPopup }: { noPopup?: boolean }) => {
  const session = await auth();
  if (!session) return <SignInButton />;
  const { name, email, role } = session.user;

  const UserInfo = () => (
    <div className="flex flex-col space-y-3 px-2 py-4">
      <div className="text-sm leading-none flex items-center gap-1" key={name}>
        <User size={16} />
        {name}
      </div>
      <p className="text-sm text-muted-foreground leading-none font-normal">
        {email}
      </p>
    </div>
  );

  return (
    <>
      {noPopup ? (
        <>
          <UserInfo />
          <UserButtonBox isAdmin={role === CONSTANTS.ADMIN} />
        </>
      ) : (
        <DropdownMenu>
          {/* trigger */}
          <DropdownMenuTrigger asChild role="button">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="relative w-8 h-8 rounded-full items-center justify-center bg-gray-200 dark:bg-gray-600"
              >
                {name ? name.slice(0, 1).toLocaleUpperCase() : "N"}
              </Button>
            </div>
          </DropdownMenuTrigger>
          {/* content */}
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <UserInfo />
              {/* buttons */}
              <UserButtonBox isAdmin={role === CONSTANTS.ADMIN} />
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserButton;
