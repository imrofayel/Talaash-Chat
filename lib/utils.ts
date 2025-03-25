import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/gs, "Code Block") // Code blocks
    .replace(/---/g, "") // Horizontal rules
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
    .replace(/`(.*?)`/g, "$1") // Code
    .replace(/#{1,6}\s?(.*)/g, "$1") // Headers
    .replace(/>\s?(.*)/g, "$1") // Blockquotes
    .replace(/\n\s*[-*+]\s/g, "\n"); // List items
}

export function filter_free_models(jsonData: { data: { models: any } }) {
  const freeModels = [];

  if (
    !jsonData ||
    !jsonData.data ||
    !jsonData.data.models ||
    !Array.isArray(jsonData.data.models)
  ) {
    console.error("Invalid JSON structure. Expected 'data' and 'models' keys with an array.");
    return [];
  }

  const models = jsonData.data.models;

  for (const model of models) {
    if (model.endpoint && model.endpoint.pricing) {
      const pricing = model.endpoint.pricing;
      if (Object.values(pricing).every((value) => value === "0")) {
        freeModels.push(model);
      }
    }
  }

  return freeModels;
}
