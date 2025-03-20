export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  thinking?: boolean;
  thinkingContent?: string;
}
