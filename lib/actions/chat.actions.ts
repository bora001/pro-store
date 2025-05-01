"use server";

import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { getSetting } from "./admin.actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function askAI(question: string) {
  try {
    const { data } = await getSetting();
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "assistant",
        content: `${data?.prompt} ${data?.manual}`,
      },
      {
        role: "user",
        content: question,
      },
    ];
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 100,
      temperature: 0.7,
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      "Sorry, I couldn't find an answer.";

    return answer;
  } catch (error) {
    console.error("Error while fetching AI response :", error);
    return "Something went wrong. Please try again later";
  }
}
