import { ChatCompletionMessageParam } from "openai/resources/index";
import openai from "../lib/openai";
import logger from "../lib/logger";
import { ApiError } from "../middlewares/error-handler.middleware";

export async function chatCompletion(messages: ChatCompletionMessageParam[]) {
  try {
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "auto",
    });

    return completion.choices[0].message.content || "No output";
  } catch (error: any) {
    logger.error("Failed to generate chat completion: " + error.message);
    throw error;
  }
}
