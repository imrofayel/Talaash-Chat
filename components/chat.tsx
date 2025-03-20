"use client";

import { ChatContainer } from "@/components/ui/chat-container";
import { Message } from "@/components/message";
import { useChatStore } from "@/store/chat";

export function Chat() {
  const { messages } = useChatStore();

  return (
    <ChatContainer className="flex-1 px-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </ChatContainer>
  );
}
