import { ReactNode } from "react";
export type RoleType = "assistant" | "user";
const ChatBubble = ({
  role = "assistant",
  children,
}: {
  role?: RoleType;
  children: ReactNode;
}) => {
  return (
    <div
      className={`p-3 rounded-lg max-w-xs ${
        role === "assistant"
          ? "border bg-white text-black"
          : "bg-violet-500 text-white"
      }`}
    >
      {children}
    </div>
  );
};

export default ChatBubble;
