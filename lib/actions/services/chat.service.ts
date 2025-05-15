"use server";
import OpenAI from "openai";
import { getSetting, getTags } from "../handler/admin/admin.setting.actions";
import { CHAT_ROLE, TYPESENSE_KEY } from "@/lib/constants";
import {
  TypesenseProductByTag,
  searchProductByTag,
} from "@/lib/typesense/product-by-tag/search-product-by-tag";
import { checkSetupTypesense } from "@/lib/typesense/check-setup";
import { getRecommendTags } from "../handler/chat.actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// get-recommend-tags
export const handleGetRecommendTags = async (question: string) => {
  const { data } = await getTags();
  const { data: setting } = await getSetting();
  const prompt = `
    List of available tags: ${data?.[0].tags.map((tag) => tag.name.toLowerCase()).join(", ")}
    ${setting?.recommendation}
    Q: ${question}
    `;

  const completion = await openai.chat.completions.create({
    model: process.env.OPEN_AI_MODEL!,
    messages: [
      {
        role: CHAT_ROLE.USER,
        content: prompt,
      },
    ],
    max_tokens: 50,
    temperature: 0.7,
  });

  const keyword =
    completion.choices[0].message.content?.trim().split(", ") || [];
  const recommendations = await searchProductByTag(keyword);
  return { data: recommendations };
};

// ask-AI
const returnMessage = ({
  role = CHAT_ROLE.ASSISTANT,
  content,
  data,
}: {
  role?: Exclude<(typeof CHAT_ROLE)[keyof typeof CHAT_ROLE], "default">;
  content: string;
  data?: TypesenseProductByTag[];
}) => {
  const defaultData = {
    role,
    content,
  };
  return {
    data: data ? { data, ...defaultData } : defaultData,
  };
};

export const handleAskAI = async (question: string) => {
  const isSetup = await checkSetupTypesense(TYPESENSE_KEY.PRODUCT_BY_TAG);
  if (!isSetup)
    return returnMessage({
      content: "Something went wrong. Please try again later",
    });

  const { data: recommendations } = await getRecommendTags(question);
  const { data } = await getSetting();
  const completion = await openai.chat.completions.create({
    model: process.env.OPEN_AI_MODEL!,
    messages: [
      {
        role: CHAT_ROLE.ASSISTANT,
        content: `${data?.prompt} ${data?.manual}`,
      },
      {
        role: CHAT_ROLE.USER,
        content: question,
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  const assistantMessage = completion.choices[0]?.message?.content?.trim();
  if (assistantMessage === "Got it. I'll look for some products for you.") {
    if (!recommendations || !recommendations.length) {
      return returnMessage({
        content: "Sorry, we couldn’t find any products matching your request.",
      });
    }
  }
  if (recommendations && recommendations.length > 0) {
    return returnMessage({
      role: CHAT_ROLE.RECOMMENDATIONS,
      content: "Here are the products that match your request",
      data: recommendations || [],
    });
  }
  return returnMessage({
    content: assistantMessage || "Sorry, I couldn't find an answer.",
  });
};
