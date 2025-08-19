import { LunosClient } from "@lunos/client";

export async function discoverModels() {
  const client = new LunosClient({ apiKey: process.env.LUNOS_API_KEY });
  const models = await client.models.getModels();
  return models;
}

export async function generateText(prompt: string): Promise<string> {
  const client = new LunosClient({ apiKey: process.env.LUNOS_API_KEY });
  const resp = await client.chat.createCompletion({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  return resp.choices?.[0].message?.content || "No output";
}
