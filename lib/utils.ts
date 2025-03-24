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
