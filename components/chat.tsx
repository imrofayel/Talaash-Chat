"use client";

import { ChatContainer } from "@/components/ui/chat-container";
import {
	MessageContent,
	Message,
	MessageActions,
	MessageAction,
} from "@/components/ui/message";
import { cn, stripMarkdown } from "@/lib/utils";
import { useChatStore } from "@/store/chat";
import { useEffect, useRef, useState } from "react";

// Hook to create typing animation string
function useTypingEffect(text: string, enabled: boolean, speed = 20) {
	const [displayed, setDisplayed] = useState(enabled ? "" : text);

	useEffect(() => {
		if (!enabled) {
			setDisplayed(text);
			return;
		}

		let i = 0;
		setDisplayed(""); // reset when text changes

		const interval = setInterval(() => {
			if (i < text.length) {
				setDisplayed((prev) => prev + text[i]);
				i++;
			} else {
				clearInterval(interval);
			}
		}, speed);

		return () => clearInterval(interval);
	}, [text, enabled, speed]);

	return displayed;
}

// Child component that safely uses the hook
function ChatMessage({ message }: { message: any }) {
	const { isReading, stopReading, voice, voiceRate, voicePitch } =
		useChatStore();
	const speakingRef = useRef<SpeechSynthesisUtterance | null>(null);

	const displayedText = useTypingEffect(
		message.content,
		message.role === "assistant",
	);

	const handleCopy = (content: string) => {
		navigator.clipboard.writeText(content);
	};

	const handleRead = (content: string) => {
		if (isReading) {
			stopReading();
			return;
		}

		const cleanText = stripMarkdown(content);
		const utterance = new SpeechSynthesisUtterance(cleanText);

		if (voice) utterance.voice = voice;
		utterance.rate = voiceRate;
		utterance.pitch = voicePitch;

		speakingRef.current = utterance;

		utterance.onend = () => {
			useChatStore.setState({ isReading: false });
			speakingRef.current = null;
		};

		useChatStore.setState({ isReading: true });
		window.speechSynthesis.speak(utterance);
	};

	return (
		<Message
			key={message.id}
			className={cn(message.role === "user" && "self-end")}
		>
			<MessageContent
				model={message.model}
				markdown={message.role !== "user"}
				message={message}
				className={cn(
					message.role === "user" &&
						"!bg-[#e5f0df] dark:!bg-emerald-900/50 dark:border-white/10 border-[#899c8d] border !text-[21px] dark:text-white/85 !py-1 px-2.5",
				)}
			>
				{displayedText}
			</MessageContent>

			{message.role === "assistant" && (
				<MessageActions
					className={cn("mt-2 gap-4", message.content === "" && "hidden")}
				>
					<MessageAction tooltip="Model">
						<div
							className="bg-[#e5f0df] p-0.5 rounded-full drop-shadow-xs px-2 border-[#899c8d] border text-[#435346] dark:!bg-emerald-900/50 dark:border-white/10 dark:text-white/85"
							style={{ fontFamily: "Geist" }}
						>
							{message.model}
						</div>
					</MessageAction>

					<MessageAction tooltip="Copy">
						<button onClick={() => handleCopy(message.content)} type="button">
							<div className="i-solar:copy-linear cursor-pointer dark:!text-white/70 hover:opacity-80 opacity-100 text-[22px]" />
						</button>
					</MessageAction>

					<MessageAction tooltip={isReading ? "Stop reading" : "Read aloud"}>
						<button onClick={() => handleRead(message.content)} type="button">
							<div
								className={cn(
									"cursor-pointer hover:opacity-80 opacity-100 dark:!text-white/70 !text-[23px]",
									isReading
										? "i-solar:volume-cross-line-duotone"
										: "i-solar:volume-loud-line-duotone",
								)}
							/>
						</button>
					</MessageAction>
				</MessageActions>
			)}
		</Message>
	);
}

export function Chat() {
	const { messages } = useChatStore();

	return (
		<ChatContainer className="flex flex-col gap-3 scrollbar-hidden !text-[#435346] !pb-[120px] pt-6 px-2 alpina w-full z-10">
			{messages.length === 0 && (
				<div className="flex flex-col gap-3 w-full h-[200px] items-center justify-center">
					<p className="text-center text-3xl !text-[#5e7e5f] dark:!text-white/80 fraunces">
						Your friendly AI!
					</p>
				</div>
			)}

			{messages.map((message) => (
				<ChatMessage key={message.id} message={message} />
			))}
		</ChatContainer>
	);
}
