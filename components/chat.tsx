"use client";

import { ChatContainer } from "@/components/ui/chat-container";
import { MessageContent, Message } from "@/components/ui/message";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat";

export function Chat() {
  const { messages } = useChatStore();

  return (
    <ChatContainer className="flex-1 px-4 pb-[120px]">
      {messages.map((message) => (
        <Message key={message.id} className={cn(message.role === "user" && "self-end")}>
          <MessageContent markdown message={message}>
            {message.content}
          </MessageContent>
        </Message>
      ))}
    </ChatContainer>
  );
}
