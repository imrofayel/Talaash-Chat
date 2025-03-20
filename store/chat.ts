import { create } from "zustand";
import { ChatMessage } from "@/lib/openai";
import { nanoid } from "nanoid";

type ChatMode = "chat" | "research";
type ModelType = string;

type ChatStore = {
  messages: ChatMessage[];
  addMessage: (content: string, role: ChatMessage["role"]) => void;
  updateLastMessage: (content: string) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  model: ModelType;
  setModel: (model: ModelType) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (content, role) =>
    set((state) => ({
      messages: [...state.messages, { id: nanoid(), content, role }],
    })),
  updateLastMessage: (content) =>
    set((state) => ({
      messages: state.messages.map((msg, i) =>
        i === state.messages.length - 1 ? { ...msg, content: msg.content + content } : msg
      ),
    })),
  isStreaming: false,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  mode: "chat", // Default mode is chat
  setMode: (mode) => set({ mode: mode }),
  model: "deepseek/deepseek_v3", // Default model
  setModel: (model) => set({ model: model }),
}));
