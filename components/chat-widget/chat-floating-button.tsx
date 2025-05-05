"use client";

import { produce } from "immer";
import ChatbotIcon from "@/assets/chat-bot-icon";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import IconButton from "../custom/IconButton";
import { useState, useTransition } from "react";
import { askAI } from "@/lib/actions/chat.actions";
import ChatScreen from "./chat-screen";
import ChatInput from "./chat-input";
import { Bot, X } from "lucide-react";
import { CHAT_ROLE, MANUAL_QUESTIONS } from "@/lib/constants";
import { DefaultQuestionKeyType, Message } from "@/types";

const ChatFloatingButton = () => {
  const [isPending, startTransition] = useTransition();
  const [messageList, setMessageList] = useState<Message[]>([
    { role: CHAT_ROLE.ASSISTANT, content: "Hello! How can I help you today?" },
    { role: CHAT_ROLE.DEFAULT, entry: MANUAL_QUESTIONS },
  ]);

  const showManualQuestion = () => {
    setMessageList((prev) =>
      produce(prev, (draft) => {
        draft.push({ role: CHAT_ROLE.DEFAULT, entry: MANUAL_QUESTIONS });
      })
    );
  };

  const sendUserMessage = async (message: string) => {
    if (!message.trim().length) return;
    setMessageList((prev) =>
      produce(prev, (draft) => {
        draft.push({ role: CHAT_ROLE.USER, content: message });
      })
    );
    startTransition(async () => {
      const { role, content, data } = await askAI(message);
      setMessageList((prev) =>
        produce(prev, (draft) => {
          draft.push({ role: CHAT_ROLE.ASSISTANT, content });
          if (role === CHAT_ROLE.RECOMMENDATIONS) {
            draft.push({ role, data });
          }
        })
      );
    });
  };

  const getManualAnswer = (type: DefaultQuestionKeyType) => {
    setMessageList((prev) =>
      produce(prev, (draft) => {
        draft.pop();
        draft.push({
          role: CHAT_ROLE.USER,
          content: MANUAL_QUESTIONS[type].question,
        });
        draft.push({
          role: CHAT_ROLE.ASSISTANT,
          content: MANUAL_QUESTIONS[type].answer,
        });
      })
    );
  };
  return (
    <div className="fixed z-10 bottom-10 right-10">
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <IconButton
            className="p-0 hover:bg-transparent"
            icon={<ChatbotIcon />}
          />
        </PopoverTrigger>

        <PopoverContent className="w-80 h-[480px] border bg-gray-50 mb-5 mr-10 shadow-lg rounded-2xl flex flex-col p-4 text-sm">
          <div className="flex justify-between pb-3 font-semibold items-center">
            <div className="flex items-center gap-2">
              <Bot className="mb-1" />
              Chat with AI
            </div>
            <PopoverClose className="text-xs">
              <X />
              {/* Close */}
            </PopoverClose>
          </div>

          {/* chat-history */}
          <ChatScreen
            messageList={messageList}
            getManualAnswer={getManualAnswer}
            isPending={isPending}
          />
          {/* input */}
          <ChatInput
            isPending={isPending}
            showManualQuestion={showManualQuestion}
            sendUserMessage={sendUserMessage}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatFloatingButton;
