"use server";

import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { getSetting, getTags } from "./admin/admin.setting.actions";
import { searchProductByTag } from "../typesense/product-by-tag/search-product-by-tag";
import { CHAT_ROLE, TYPESENSE_KEY } from "../constants";
import { checkSetupTypesense } from "../typesense/check-setup";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getRecommendTags = async (question: string) => {
  try {
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
    return recommendations;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function askAI(question: string) {
  try {
    const isSetup = await checkSetupTypesense(TYPESENSE_KEY.PRODUCT_BY_TAG);
    if (!isSetup) {
      return {
        content: "Something went wrong. Please try again later",
      };
    }
    const recommendations = await getRecommendTags(question);
    const { data } = await getSetting();
    const messages: ChatCompletionMessageParam[] = [
      {
        role: CHAT_ROLE.ASSISTANT,
        content: `${data?.prompt} ${data?.manual}`,
      },
      {
        role: CHAT_ROLE.USER,
        content: question,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPEN_AI_MODEL!,
      messages,
      max_tokens: 100,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content?.trim();
    const answer = assistantMessage || "Sorry, I couldn't find an answer.";

    if (assistantMessage === "Got it. I'll look for some products for you.") {
      if (!recommendations || !recommendations.length) {
        return {
          content:
            "Sorry, we couldn’t find any products matching your request.",
        };
      }
    }
    if (recommendations && recommendations.length > 0) {
      return {
        role: CHAT_ROLE.RECOMMENDATIONS,
        content: "Here are the products that match your request",
        data: recommendations || [],
      };
    }
    return { content: answer };
  } catch (error) {
    console.error("Error while fetching AI response :", error);
    return {
      content: "Something went wrong. Please try again later",
    };
  }
}
