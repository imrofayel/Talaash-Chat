"use client";

import { ChatContainer } from "@/components/ui/chat-container";
import { MessageContent, Message } from "@/components/ui/message";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat";

export function Chat() {
  const { messages } = useChatStore();

  return (
    <ChatContainer className="flex gap-3 !text-[#0d3c26] pb-[120px] alpina w-full">
      {messages.map((message) => (
        <Message key={message.id} className={cn(message.role === "user" && "self-end")}>
          <MessageContent
            markdown
            message={message}
            className={cn(message.role == "user" && "!bg-[#f5eadc]")}
          >
            {message.content}
          </MessageContent>
        </Message>
      ))}
    </ChatContainer>
  );
}
