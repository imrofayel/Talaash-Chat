"use client";

import { PromptInput, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown, Square, Brain, ArrowUpRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ChatInput() {
  const [input, setInput] = useState<string>("");
  const {
    isStreaming,
    setIsStreaming,
    addMessage,
    updateLastMessage,
    mode,
    setMode,
    model,
    setModel,
  } = useChatStore();
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
        body: JSON.stringify({
          message: input,
          mode,
          model,
          messages: useChatStore.getState().messages,
        }),
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

  const handleStop = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  };

  const modelOptions = [
    // KEEP THE COMMENTED OUT MODELS
    // "deepseek/deepseek-r1-turbo",
    // "deepseek/deepseek-v3-turbo",
    "qwen/qwq-32b",
    "meta-llama/llama-3.1-8b-instruct",
    // "deepseek/deepseek-r1",
    "deepseek/deepseek_v3",
    "meta-llama/llama-3.1-70b-instruct",
    "meta-llama/llama-3.3-70b-instruct",
    "mistralai/mistral-nemo",
    // "deepseek/deepseek-r1-distill-qwen-14b",
    // "deepseek/deepseek-r1-distill-qwen-32b",
    // "deepseek/deepseek-r1-distill-llama-70b",
    "Sao10K/L3-8B-Stheno-v3.2",
    "gryphe/mythomax-l2-13b",
    // "deepseek/deepseek-r1-distill-llama-8b",
    "qwen/qwen-2.5-72b-instruct",
    "meta-llama/llama-3-8b-instruct",
    "microsoft/wizardlm-2-8x22b",
    "google/gemma-2-9b-it",
    "mistralai/mistral-7b-instruct",
    "meta-llama/llama-3-70b-instruct",
    "openchat/openchat-7b",
    "nousresearch/hermes-2-pro-llama-3-8b",
    "sao10k/l3-70b-euryale-v2.1",
    "cognitivecomputations/dolphin-mixtral-8x22b",
    "jondurbin/airoboros-l2-70b",
    "nousresearch/nous-hermes-llama2-13b",
    "teknium/openhermes-2.5-mistral-7b",
    "sophosympatheia/midnight-rose-70b",
    "sao10k/l3-8b-lunaris",
    "qwen/qwen-2-vl-72b-instruct",
    "meta-llama/llama-3.2-1b-instruct",
    "meta-llama/llama-3.2-11b-vision-instruct",
    "meta-llama/llama-3.2-3b-instruct",
    "meta-llama/llama-3.1-8b-instruct-bf16",
    "sao10k/l31-70b-euryale-v2.2",
    "qwen/qwen-2-7b-instruct",
  ];

  const isModelSelectionEnabled = mode === "chat";

  return (
    <div className="w-full flex justify-center items-center">
      <PromptInput
        value={input}
        onValueChange={handleValueChange}
        isLoading={isStreaming}
        onSubmit={handleSubmit}
        className="w-full max-w-[38rem] !rounded-xl !bg-neutral-100/30 !p-1 drop-shadow-xs border !border-gray-200/60"
      >
        <PromptInputTextarea
          placeholder="Ask Anything"
          className="text-[16px] bg-white  placeholder:text-[16px] md:text-[16px] placeholder:text-gray-950 !mb-3 !rounded-lg drop-shadow-xs !px-3.5 !py-2.5 text-gray-950 outline-none ring-0 border-gray-100"
          rows={2}
        />
        <PromptInputActions className="flex h-[32px] items-center justify-between gap-2 !px-1 !mb-0.5">
          <div className="flex flex-wrap items-center gap-x-1.5">
            <Button
              variant="ghost"
              aria-label="Chat"
              className={`h-7 w-auto gap-1 bg-white border text-gray-950 drop-shadow-xs p-1 !px-2 hover:bg-white border-gray-100 text-[15px] font-normal [&_svg]:!size-[18px]cursor-pointer rounded-lg ${
                mode === "chat" && " bg-black/3 drop-shadow-none hover:bg-black/3"
              }`}
              onClick={() => {
                setMode("chat");
                setModel("deepseek/deepseek_v3");
              }}
            >
              <MessageCircle color="#030712" />
              Chat
            </Button>

            <Button
              variant="ghost"
              aria-label="Research"
              className={`h-7 w-auto gap-1 bg-white border text-gray-950 drop-shadow-xs p-1 !px-2 hover:bg-white border-gray-100 text-[15px] font-normal [&_svg]:!size-[18px]cursor-pointer rounded-lg ${
                mode === "research" && " bg-black/3 drop-shadow-none hover:bg-black/3"
              }`}
              onClick={() => {
                setMode("research");
                setModel("deepseek/deepseek-r1");
              }}
            >
              <Brain />
              Deepthink
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={!isModelSelectionEnabled}>
                <Button
                  variant="ghost"
                  aria-label="Select Model"
                  disabled={!isModelSelectionEnabled}
                  className={`h-7 w-auto gap-1 bg-white border text-gray-950 drop-shadow-xs p-1 !px-2 hover:bg-white border-gray-100 text-[15px] font-normal [&_svg]:!size-[18px]cursor-pointer rounded-lg ${
                    isModelSelectionEnabled ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {model.split("/").pop()}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[250px] rounded-xl overflow-auto bg-white border-gray-200 !drop-shadow-xs shadow-none"
                style={{ maxHeight: "200px" }}
              >
                {modelOptions.map((modelOption) => (
                  <DropdownMenuItem
                    key={modelOption}
                    onClick={() => setModel(modelOption)}
                    disabled={!isModelSelectionEnabled}
                  >
                    {modelOption}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-x-2.5">
            <Button
              size="icon"
              aria-label={isStreaming ? "Stop response" : "Send message"}
              className={cn(
                "h-8 w-8 rounded-md p-1 font-semibold !text-gray-950 hover:bg-white bg-white",
                isStreaming ? "[&_svg]:!size-4.5" : "[&_svg]:!size-5"
              )}
              onClick={isStreaming ? handleStop : handleSubmit}
              disabled={!isStreaming && !input.trim()}
            >
              {isStreaming ? <Square className="[&_svg]:!size-4" /> : <ArrowUpRight />}
            </Button>
          </div>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
}
