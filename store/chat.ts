import { create } from "zustand";
import type { ChatMessage } from "@/lib/openai";
import { nanoid } from "nanoid";

type ChatMode = "chat";
type ModelType = string;

type ChatStore = {
	messages: ChatMessage[];
	input: string;
	setInput: (input: string) => void;
	addMessage: (
		content: string,
		role: ChatMessage["role"],
		model: string,
	) => void;
	updateLastMessage: (content: string) => void;
	isStreaming: boolean;
	setIsStreaming: (streaming: boolean) => void;
	mode: ChatMode;
	setMode: (mode: ChatMode) => void;
	model: ModelType;
	setModel: (model: ModelType) => void;
	isReading: boolean;
	stopReading: () => void;
	voice: SpeechSynthesisVoice | null;
	setVoice: (voice: SpeechSynthesisVoice) => void;
	voiceRate: number;
	setVoiceRate: (rate: number) => void;
	voicePitch: number;
	setVoicePitch: (pitch: number) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
	messages: [],
	input: "",
	setInput: (input) => set({ input }),
	addMessage: (content, role, model) =>
		set((state) => ({
			messages: [
				...state.messages,
				{
					id: nanoid(),
					content,
					role,
					model,
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
	model: "mistralai/mistral-7b-instruct:free", // Default model
	setModel: (model) => set({ model: model }),
	isReading: false,
	stopReading: () => {
		window.speechSynthesis.cancel();
		set({ isReading: false });
	},
	voice: null,
	setVoice: (voice) => set({ voice }),
	voiceRate: 1,
	setVoiceRate: (rate) => set({ voiceRate: rate }),
	voicePitch: 1,
	setVoicePitch: (pitch) => set({ voicePitch: pitch }),
}));
