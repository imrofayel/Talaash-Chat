"use client";

import { useState } from "react";
import { Markdown } from "@/components/ui/markdown";
import { Button } from "@/components/ui/button";
import { EyeIcon, Sparkles, CopyIcon, CheckIcon } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { parseThinking } from "@/lib/parse-thinking";
import { Highlighter } from "shiki";

export interface MessageProps {
  message: ChatMessage;
  highlighter: Highlighter | null;
}

export function Message({ message, highlighter }: MessageProps) {
  const [showThinking, setShowThinking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CopyButton = ({ text }: { text: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 absolute top-2 right-2"
      onClick={() => handleCopy(text)}
    >
      {copied ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
    </Button>
  );

  // Parse thinking content from message
  const { thinking, response } = parseThinking(message.content);
  const hasThinking = message.role === "assistant" && thinking;

  if (message.role === "user") {
    return (
      <div className="mb-6 flex flex-col items-end">
        <div className="rounded-lg px-4 py-2 bg-primary/90 text-primary-foreground relative">
          <CopyButton text={message.content} />
          <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <Markdown highlighter={highlighter}>{message.content}</Markdown>
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
          <div className="rounded-lg px-4 py-2 bg-secondary/80 backdrop-blur-sm relative">
            <CopyButton text={showThinking ? thinking || "" : response} />
            <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <Markdown highlighter={highlighter}>
                {showThinking ? thinking || "" : response}
              </Markdown>
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
