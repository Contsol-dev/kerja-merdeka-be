import OpenAI from "openai";
import env from "../configs/env.config";

const openai = new OpenAI({
  baseURL: env.UNLI.API_URL,
  apiKey: env.UNLI.API_KEY,
});

export default openai;
