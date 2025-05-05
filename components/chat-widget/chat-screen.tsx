import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import ThinkingDot from "../common/thinking-dot";
import ChatBubble from "./chat-bubble";
import ChatRecommendations from "./chat-recommendations";
import { CHAT_ROLE, MANUAL_QUESTIONS } from "@/lib/constants";
import { DefaultQuestionKeyType, Message } from "@/types";

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
          className={`flex ${message.role === CHAT_ROLE.ASSISTANT ? "justify-start" : "justify-end"} `}
        >
          {message.role === CHAT_ROLE.DEFAULT && (
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
          )}
          {(message.role === CHAT_ROLE.ASSISTANT ||
            message.role === CHAT_ROLE.USER) && (
            <ChatBubble role={message.role}>{message.content}</ChatBubble>
          )}
          {message.role === CHAT_ROLE.RECOMMENDATIONS && (
            <ChatRecommendations data={message.data} />
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
