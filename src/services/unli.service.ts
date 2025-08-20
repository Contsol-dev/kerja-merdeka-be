import { ChatCompletionMessageParam } from "openai/resources/index";
import openai from "../lib/openai";

export async function chatCompletion(messages: ChatCompletionMessageParam[]) {
  try {
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "auto",
    });

    return completion.choices[0].message.content || "No output";
  } catch (error) {
    throw new Error("Failed to generate chat completion");
  }
}
