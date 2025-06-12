import { CHAT_ROLE } from "@/lib/constants";
import { ChatRoleType } from "@/types";
import { ReactNode } from "react";
const ChatBubble = ({
  role = CHAT_ROLE.ASSISTANT,
  children,
}: {
  role?: ChatRoleType;
  children: ReactNode;
}) => {
  return (
    <div
      className={`p-3 rounded-lg max-w-xs ${
        role === CHAT_ROLE.ASSISTANT
          ? "border bg-white text-black"
          : "bg-violet-500 text-white"
      }`}
    >
      {children}
    </div>
  );
};

export default ChatBubble;
