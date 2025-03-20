"use client";

import { PromptInput, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Paperclip, Atom, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chat";

export function ChatInput() {
  const [input, setInput] = useState<string>("");
  const { isStreaming, setIsStreaming, addMessage, updateLastMessage } = useChatStore();
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortController.current?.abort();
    };
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isStreaming) return;

    // Abort previous request if exists
    abortController.current?.abort();
    abortController.current = new AbortController();

    addMessage(input.trim(), "user");
    setIsStreaming(true);
    addMessage("", "assistant");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
        signal: abortController.current.signal,
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        if (text) updateLastMessage(text);
      }

      setInput("");
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Chat Error:", error);
      updateLastMessage(" [Error: Message failed to complete]");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleValueChange = (value: string) => {
    setInput(value);
  };

  return (
    <PromptInput
      value={input}
      onValueChange={handleValueChange}
      isLoading={isStreaming}
      onSubmit={handleSubmit}
      className="w-full max-w-[38rem] !rounded-lg bg-[#1e1f1e] !p-1 shadow-[0_0_0_0.5px_#343434] border border-[#2a2e2c]"
    >
      <PromptInputTextarea
        placeholder="Ask Anything"
        className="text-[16px] bg-[#2f313070] placeholder:text-[16px] md:text-[16px] placeholder:opacity-80 !mb-3 !rounded-md drop-shadow-xs !px-3.5 !py-2.5"
        rows={2}
      />
      <PromptInputActions className="flex h-[32px] items-center justify-between gap-2 !px-0.5 !mb-0.5">
        <div className="flex flex-wrap items-center gap-x-0.5">
          <Button
            variant="ghost"
            aria-label="Chat"
            className="h-7 w-auto gap-1 bg-[#1e1f1e] p-1 !px-1.5 text-sm font-normal [&_svg]:size-5.5 opacity-65 cursor-pointer hover:bg-black/10 rounded-md"
          >
            <MessageCircle />
            Chat
          </Button>

          <Button
            variant="ghost"
            aria-label="Research"
            className="h-7 w-auto gap-1 bg-[#1e1f1e] p-1 !px-2 text-sm font-normal [&_svg]:size-5.5 opacity-65 cursor-pointer hover:bg-black/10 rounded-md"
          >
            <Atom />
            Research
          </Button>
        </div>
        <div className="flex items-center gap-x-2.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Attach files"
            className="h-8 w-8 rounded-md p-1 font-semibold hover:bg-black/10 focus-visible:outline-black dark:focus-visible:outline-white opacity-65 [&_svg]:size-6.5"
          >
            <Paperclip className="[transform:rotateZ(45deg)_rotateY(180deg)]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Send message"
            className="h-8 w-8 rounded-md p-1 font-semibold hover:bg-black/10 opacity-65 [&_svg]:size-6.5"
            onClick={handleSubmit}
            disabled={!input.trim() || isStreaming}
          >
            <Send />
          </Button>
        </div>
      </PromptInputActions>
    </PromptInput>
  );
}
