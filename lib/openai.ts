import OpenAI from "openai";

export const openai = new OpenAI({
	baseURL: process.env.OPEN_BASE_URL,
	apiKey: process.env.OPENAI_API_KEY,
});

export type ChatMessage = {
	id: string;
	content: string;
	model: string;
	role: "assistant" | "user" | "system";
};
