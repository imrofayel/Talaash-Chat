"use client";

import { PromptInput, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Paperclip, Atom } from "lucide-react";
import { useState } from "react";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleValueChange = (value: string) => {
    setInput(value);
  };

  return (
    <PromptInput
      value={input}
      onValueChange={handleValueChange}
      isLoading={isLoading}
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

          {/* <Button
              variant="default"
              size="icon"
              aria-label="Send message"
              className="h-8 w-8 rounded-full cursor-pointer hover:bg-[#252725] p-1 text-white opacity-80 bg-[#252725] [&_svg]:size-7"
              onClick={handleSubmit}
              disabled={!input}
            >
              {isLoading ? <Square /> : <Mic />}
            </Button> */}
        </div>
      </PromptInputActions>
    </PromptInput>
  );
}
