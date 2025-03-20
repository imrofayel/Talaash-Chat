"use client";

import { ChatContainer } from "@/components/ui/chat-container";
import { Markdown } from "@/components/ui/markdown";
import { useChatStore } from "@/store/chat";
import { cn } from "@/lib/utils";

export function Chat() {
  const { messages } = useChatStore();

  return (
    <ChatContainer className="flex-1 px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "mb-6 flex flex-col",
            message.role === "assistant" ? "items-start" : "items-end"
          )}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-2 prose prose-invert max-w-none",
              message.role === "assistant"
                ? "bg-secondary [&_think]:text-yellow-400 [&_think]:opacity-75 [&_think]:italic"
                : "bg-primary text-primary-foreground"
            )}
          >
            <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        </div>
      ))}
    </ChatContainer>
  );
}
