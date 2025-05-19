"use server";

import { handleAsync } from "@/utils/handle-async";
import { handleAskAI, handleGetRecommendTags } from "../services/chat.service";

// get-recommend-tags
export async function getRecommendTags(question: string) {
  return handleAsync(() => handleGetRecommendTags(question));
}
// ask-AI
export async function askAI(question: string) {
  return handleAsync(() => handleAskAI(question));
}
