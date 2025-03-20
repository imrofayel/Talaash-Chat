"use client";

import { useState } from "react";
import { Markdown } from "@/components/ui/markdown";
import { Button } from "@/components/ui/button";
import { EyeIcon, Sparkles } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { parseThinking } from "@/lib/parse-thinking";

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const [showThinking, setShowThinking] = useState(false);

  // Parse thinking content from message
  const { thinking, response } = parseThinking(message.content);
  const hasThinking = message.role === "assistant" && thinking;

  if (message.role === "user") {
    return (
      <div className="mb-6 flex flex-col items-end">
        <div className="rounded-lg px-4 py-2 bg-primary/90 text-primary-foreground">
          <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <Markdown>{message.content}</Markdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col items-start">
      {message.thinking ? (
        // Streaming/Thinking state
        <div className="flex flex-col gap-2">
          <div className="rounded-lg px-4 py-2 bg-muted/50 border border-muted">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Thinking...</span>
            </div>
            <div className="font-mono text-sm text-muted-foreground whitespace-pre-wrap thinking-cursor">
              {thinking}
            </div>
          </div>
        </div>
      ) : (
        // Completed response state
        <div className="flex flex-col gap-2 w-full">
          <div className="rounded-lg px-4 py-2 bg-secondary/80 backdrop-blur-sm">
            <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <Markdown>{showThinking ? thinking || "" : response}</Markdown>
            </div>
          </div>
          {hasThinking && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowThinking(!showThinking)}
              className="self-start text-xs"
            >
              <EyeIcon className="h-3 w-3 mr-1" />
              {showThinking ? "Hide Reasoning" : "Show Reasoning"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
