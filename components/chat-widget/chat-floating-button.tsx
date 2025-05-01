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

export const MANUAL_QUESTIONS = {
  delivery: {
    question: "🕰️ Delivery time",
    answer:
      "Generally, shipping will be completed within 14 days after placing an order. However, delivery times may vary depending on the region and logistics situation.",
  },
  payment: {
    question: "💰 Payment methods",
    answer: "We offer PayPal and Stripe as payment methods.",
  },
  issue: {
    question: "⚠️ Product issue",
    answer:
      "If there is a defect in the product, you can request an exchange or refund within 7 days of receiving the item. Please contact our customer service for detailed guidance.",
  },
  shipping: {
    question: "📦 Shipping fee",
    answer: "We offer free shipping for orders over $100.",
  },
} as const;
export type DefaultQuestionKeyType = keyof typeof MANUAL_QUESTIONS;

type DefaultQuestionType = {
  [key in DefaultQuestionKeyType]: {
    question: string;
    answer: string;
  };
};
export type Message =
  | ({
      role: "user" | "assistant";
      content: string;
    } & { entry?: never })
  | ({
      role: "default";
      entry: DefaultQuestionType;
    } & { content?: never });

const ChatFloatingButton = () => {
  const [isPending, startTransition] = useTransition();
  const [messageList, setMessageList] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you today?" },
    { role: "default", entry: MANUAL_QUESTIONS },
  ]);

  const showManualQuestion = () => {
    setMessageList((prev) =>
      produce(prev, (draft) => {
        draft.push({ role: "default", entry: MANUAL_QUESTIONS });
      })
    );
  };

  const sendUserMessage = async (message: string) => {
    if (!message.trim().length) return;
    setMessageList((prev) =>
      produce(prev, (draft) => {
        draft.push({ role: "user", content: message });
      })
    );
    startTransition(async () => {
      const answer = await askAI(message);
      setMessageList((prev) =>
        produce(prev, (draft) => {
          draft.push({ role: "assistant", content: answer });
        })
      );
    });
  };

  const getManualAnswer = (type: DefaultQuestionKeyType) => {
    setMessageList((prev) =>
      produce(prev, (draft) => {
        draft.pop();
        draft.push({
          role: "user",
          content: MANUAL_QUESTIONS[type].question,
        });
        draft.push({
          role: "assistant",
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
