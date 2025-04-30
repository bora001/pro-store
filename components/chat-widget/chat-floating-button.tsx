"use client";

import { produce } from "immer";
import ChatbotIcon from "@/assets/chat-bot-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import IconButton from "../custom/IconButton";
import { Textarea } from "../ui/textarea";
import { CircleHelp, SendHorizonal } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant" | "default"; // (또는 system 도 있을 수 있어)
const MANUAL_QUESTIONS = {
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
type DefaultQuestionKeyType = keyof typeof MANUAL_QUESTIONS;

type DefaultQuestionType = {
  [key in DefaultQuestionKeyType]: {
    question: string;
    answer: string;
  };
};
type Message =
  | ({
      role: "user" | "assistant";
      content: string;
    } & { entry?: never })
  | ({
      role: "default";
      entry: DefaultQuestionType;
    } & { content?: never });

const ChatFloatingButton = () => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const [messageList, setMessageList] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you today?" },
    { role: "default", entry: MANUAL_QUESTIONS },
  ]);

  const showManualQuestion = () => {
    setMessageList((prev) =>
      produce(prev, (draft) => {
        draft.push({ role: "default", entry: MANUAL_QUESTIONS }); // 그냥 수정만 하면 됨
      })
    );
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const [userMessage, setUserMessage] = useState("");
  const sendUserMessage = () => {
    setMessageList((prev) =>
      produce(prev, (draft) => {
        draft.push({ role: "user", content: userMessage });
      })
    );
    setUserMessage("");
  };
  const enterChat = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage();
    } else {
      setUserMessage(target.value);
    }
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
    <div className="fixed z-10 bottom-10 right-10 ">
      <Popover>
        <PopoverTrigger asChild>
          <IconButton
            className="p-0 hover:bg-transparent"
            icon={<ChatbotIcon />}
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 max-h-[540px] border bg-gray-50 mb-5 mr-10 shadow-lg rounded-2xl flex flex-col p-4 text-sm ">
          {/* chat-history */}
          <div className="flex flex-col flex-1 gap-3 overflow-y-scroll">
            {messageList.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
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
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      message.role === "assistant"
                        ? "border bg-white text-black"
                        : "bg-violet-500 text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
          {/* input */}
          <div className="m-2 flex flex-col border justify-end items-end rounded-md bg-white">
            <Textarea
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
              <div
                className="p-2 bg-violet-600 cursor-pointer text-white"
                onClick={() => sendUserMessage()}
              >
                <SendHorizonal />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatFloatingButton;
