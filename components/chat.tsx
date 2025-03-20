"use client";

import { ChatContainer } from "@/components/ui/chat-container";
import { Message } from "@/components/message";
import { useChatStore } from "@/store/chat";
import { createHighlighter, createJavaScriptRegexEngine, Highlighter } from "shiki";
import { useEffect, useState } from "react";

export function Chat() {
  const { messages } = useChatStore();
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    async function initHighlighter() {
      const hl = await createHighlighter({
        langs: [
          "javascript",
          "typescript",
          "tsx",
          "bash",
          "json",
          "markdown",
          "html",
          "python",
          "go",
          "rust",
        ],
        themes: ["github-dark"],
        engine: createJavaScriptRegexEngine(),
      });
      setHighlighter(hl);
    }
    initHighlighter();
  }, []);

  return (
    <ChatContainer className="flex-1 px-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} highlighter={highlighter} />
      ))}
    </ChatContainer>
  );
}
