import { create } from "zustand";
import { ChatMessage } from "@/lib/openai";
import { nanoid } from "nanoid";

type ChatMode = "chat";
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
  isReading: boolean;
  stopReading: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (content, role) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: nanoid(),
          content,
          role,
        },
      ],
    })),
  updateLastMessage: (content) =>
    set((state) => {
      const lastMessageIndex = state.messages.length - 1;
      if (lastMessageIndex < 0) return state; // No messages yet

      const updatedMessages = [...state.messages];
      updatedMessages[lastMessageIndex] = {
        ...updatedMessages[lastMessageIndex],
        content: content,
      };

      return { ...state, messages: updatedMessages };
    }),
  isStreaming: false,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  mode: "chat", // Default mode is chat
  setMode: (mode) => set({ mode: mode }),
  model: "deepseek/deepseek-chat:free", // Default model
  setModel: (model) => set({ model: model }),
  isReading: false,
  stopReading: () => {
    window.speechSynthesis.cancel();
    set({ isReading: false });
  },
}));
