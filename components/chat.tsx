"use client";

import { ChatContainer } from "@/components/ui/chat-container";
import { MessageContent, Message, MessageActions, MessageAction } from "@/components/ui/message";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat";
import { Copy, Volume2Icon } from "lucide-react";
import { useRef } from "react";
import { stripMarkdown } from "@/lib/utils";

export function Chat() {
  const { messages, isReading, stopReading, voice, voiceRate, voicePitch } = useChatStore();
  const speakingRef = useRef<SpeechSynthesisUtterance | null>(null);

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
    <ChatContainer className="flex gap-3 !text-[#0d3c26] pb-[120px] pt-6 px-2 alpina w-full">
      {messages.map((message) => (
        <Message key={message.id} className={cn(message.role === "user" && "self-end")}>
          <MessageContent
            markdown
            message={message}
            className={cn(message.role == "user" && "!bg-[#f5eadc] px-2.5")}
          >
            {message.content}
          </MessageContent>
          {message.role === "assistant" && (
            <MessageActions className={cn("mt-2 gap-4", message.content === "" && "hidden")}>
              <MessageAction tooltip="Copy">
                <Copy
                  className="h-4.5 w-4.5 cursor-pointer hover:opacity-70"
                  onClick={() => handleCopy(message.content)}
                />
              </MessageAction>
              <MessageAction tooltip={isReading ? "Stop reading" : "Read aloud"}>
                <Volume2Icon
                  className={cn(
                    "h-4.5 w-4.5 cursor-pointer hover:opacity-70",
                    isReading && "text-primary"
                  )}
                  onClick={() => handleRead(message.content)}
                />
              </MessageAction>
            </MessageActions>
          )}
        </Message>
      ))}
    </ChatContainer>
  );
}
