import { auth } from "@/auth";
import LinkButton from "@/components/custom/LinkButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PATH } from "@/lib/constants";
import { UserIcon } from "lucide-react";
import UserButtonBox from "./user-buttons-box";

const UserButton = async () => {
  const session = await auth();
  if (!session)
    return (
      <LinkButton icon={<UserIcon />} title="Sign In" url={PATH.SIGN_IN} />
    );

  return (
    <DropdownMenu>
      {/* trigger */}
      <DropdownMenuTrigger asChild>
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="relative w-8 h-8 rounded-full items-center justify-center bg-gray-200"
          >
            {session.user?.name
              ? session.user.name.slice(0, 1).toLocaleUpperCase()
              : "N"}
          </Button>
        </div>
      </DropdownMenuTrigger>
      {/* content */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-2 mb-6">
            <div className="text-sm font-medium leading-none">
              {session.user?.name}
            </div>
            <div className="text-sm text-muted-foreground leading-none">
              {session.user?.email}
            </div>
          </div>
          {/* buttons */}
          <UserButtonBox />
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
