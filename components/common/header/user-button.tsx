import { auth } from "@/auth";
import LinkButton from "@/components/custom/LinkButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CONSTANTS, PATH } from "@/lib/constants";
import { User, UserIcon } from "lucide-react";
import UserButtonBox from "./user-buttons-box";

const UserButton = async () => {
  const session = await auth();
  if (!session)
    return (
      <LinkButton icon={<UserIcon />} title="Sign In" url={PATH.SIGN_IN} />
    );
  const { name, email, role } = session.user;
  return (
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
          <div className="flex flex-col space-y-3 px-2 py-4">
            <div
              className="text-sm leading-none flex items-center gap-1"
              key={name}
            >
              <User size={16} />
              {name}
            </div>
            <p className="text-sm text-muted-foreground leading-none font-normal">
              {email}
            </p>
          </div>
          {/* buttons */}
          <UserButtonBox isAdmin={role === CONSTANTS.ADMIN} />
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
