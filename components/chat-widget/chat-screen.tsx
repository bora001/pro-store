import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
  DefaultQuestionKeyType,
  MANUAL_QUESTIONS,
  Message,
} from "./chat-floating-button";
import ThinkingDot from "../common/thinking-dot";
import ChatBubble from "./chat-bubble";

const ChatScreen = ({
  isPending,
  messageList,
  getManualAnswer,
}: {
  isPending: boolean;
  messageList: Message[];
  getManualAnswer: (type: DefaultQuestionKeyType) => void;
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList, isPending]);
  return (
    <div className="flex flex-col flex-1 gap-3 overflow-y-scroll">
      {messageList.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"} `}
        >
          {message.role === "default" ? (
            <div className="flex gap-1 flex-wrap ">
              {Object.entries(message.entry).map(([key, value]) => (
                <Button
                  className="self-start flex-1 bg-violet-500"
                  key={key}
                  onClick={() =>
                    getManualAnswer(key as keyof typeof MANUAL_QUESTIONS)
                  }
                >
                  {value.question}
                </Button>
              ))}
            </div>
          ) : (
            <ChatBubble role={message.role}>{message.content}</ChatBubble>
          )}
        </div>
      ))}
      {isPending && (
        <ChatBubble>
          <ThinkingDot />
        </ChatBubble>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatScreen;
