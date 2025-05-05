import { CircleHelp, SendHorizonal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { KeyboardEvent, useState } from "react";
import { Button } from "../ui/button";
import { debounce } from "lodash";

const ChatInput = ({
  isPending,
  showManualQuestion,
  sendUserMessage,
}: {
  isPending: boolean;
  showManualQuestion: () => void;
  sendUserMessage: (message: string) => Promise<void>;
}) => {
  const [userMessage, setUserMessage] = useState("");

  const sendMessage = debounce(() => {
    sendUserMessage(userMessage);
    setUserMessage("");
  }, 500);

  const enterChat = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      setUserMessage("");
    } else {
      setUserMessage(target.value);
    }
  };
  return (
    <div className="m-2 flex flex-col border justify-end items-end rounded-md bg-white">
      <Textarea
        placeholder="Ask Anything 🙌"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        className="resize-none border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        onKeyDown={(e) => enterChat(e)}
      />

      <div className="flex justify-between w-full">
        <div
          className="p-2  cursor-pointer "
          onClick={() => showManualQuestion()}
        >
          <CircleHelp />
        </div>
        <Button
          disabled={isPending}
          className="p-2 bg-violet-600 cursor-pointer text-white w-10"
          onClick={() => sendMessage()}
        >
          <SendHorizonal />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
