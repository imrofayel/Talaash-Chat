import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: process.env.OPEN_BASE_URL,
  apiKey: process.env.OPEN_API_KEY,
});

export type ChatMessage = {
  id: string;
  content: string;
  role: "assistant" | "user" | "system";
  sources?: Array<{
    title: string;
    url: string;
    summary?: string;
    icon?: string;
    author?: string;
  }>;
};
