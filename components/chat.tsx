"use client";

import { ChatContainer } from "@/components/ui/chat-container";
import { MessageContent, Message } from "@/components/ui/message";
import { useChatStore } from "@/store/chat";

export function Chat() {
  const { messages } = useChatStore();

  return (
    <ChatContainer className="flex-1 px-4">
      {messages.map((message) => (
        <Message key={message.id}>
          <MessageContent markdown>{message.content}</MessageContent>
        </Message>
      ))}
    </ChatContainer>
  );
}
