"use client";

import { PromptInput, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown, Square, Brain, ArrowUpRight, Search } from "lucide-react";
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

  // type ChatMode = "chat" | "research" | "search";
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
      let accumulatedText = "";
      let sources = [];

      try {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          try {
            // Check if the chunk is a valid JSON (for sources)
            const jsonData = JSON.parse(chunk);
            if (jsonData.sources) {
              sources = jsonData.sources;
            }
            if (jsonData.content) {
              accumulatedText = jsonData.content;
              updateLastMessage(accumulatedText, sources);
            }
          } catch {
            // If not valid JSON, treat as text chunk
            accumulatedText += chunk;
            updateLastMessage(accumulatedText, sources);
          }
        }
      } catch (error) {
        console.error("Streaming error:", error);
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
    "google/gemini-exp-1206:free",
    "google/gemini-2.0-pro-exp-02-05:free",
    "google/gemini-2.0-flash-thinking-exp:free",
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "google/gemini-flash-1.5-8b-exp",
    "deepseek/deepseek-r1-zero:free",
    "deepseek/deepseek-r1:free",
    "google/gemma-3-4b-it:free",
    "google/gemma-3-12b-it:free",
    "qwen/qwq-32b:free",
    "nousresearch/deephermes-3-llama-3-8b-preview:free",
    "qwen/qwen2.5-vl-72b-instruct:free",
    "deepseek/deepseek-chat:free",
    "nvidia/llama-3.1-nemotron-70b-instruct:free",
    "meta-llama/llama-3.2-1b-instruct:free",
    "meta-llama/llama-3.2-11b-vision-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "deepseek/deepseek-r1-distill-llama-70b:free",
    "mistralai/mistral-nemo:free",
    "google/gemma-3-27b-it:free",
    "deepseek/deepseek-r1-distill-qwen-14b:free",
    "google/learnlm-1.5-pro-experimental:free",
    "google/gemini-2.0-flash-thinking-exp-1219:free",
    "open-r1/olympiccoder-7b:free",
    "open-r1/olympiccoder-32b:free",
    "rekaai/reka-flash-3:free",
    "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
    "cognitivecomputations/dolphin3.0-mistral-24b:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
    "qwen/qwen-2.5-coder-32b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "google/gemma-3-1b-it:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "qwen/qwq-32b-preview:free",
    "deepseek/deepseek-r1-distill-qwen-32b:free",
    "moonshotai/moonlight-16b-a3b-instruct:free",
    "qwen/qwen-2-7b-instruct:free",
    "google/gemma-2-9b-it:free",
  ];

  const isModelSelectionEnabled = mode === "chat";

  return (
    <div className="w-full absolute bottom-4 flex justify-center items-center">
      <PromptInput
        value={input}
        onValueChange={handleValueChange}
        isLoading={isStreaming}
        onSubmit={handleSubmit}
        className="w-full max-w-[38rem] !rounded-xl !bg-neutral-100 !p-1 drop-shadow-xs border !border-gray-200/60"
      >
        <PromptInputTextarea
          placeholder="Ask Anything"
          className="text-[16px] bg-white  placeholder:text-[16px] md:text-[16px] placeholder:text-gray-950 !mb-3 !rounded-lg drop-shadow-xs !px-3.5 !py-2.5 text-gray-950 outline-none ring-0 border-gray-100"
          rows={2}
        />
        <PromptInputActions className="flex h-[32px] items-center justify-between gap-2 !px-1 !mb-0.5">
          <div className="flex flex-wrap items-center gap-x-1.5">
            <Button
              disabled
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
              disabled
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

            <Button
              disabled
              variant="ghost"
              aria-label="Search"
              className={`h-7 w-auto gap-1 bg-white border text-gray-950 drop-shadow-xs p-1 !px-2 hover:bg-white border-gray-100 text-[15px] font-normal [&_svg]:!size-[18px]cursor-pointer rounded-lg ${
                mode === "search" && " bg-black/3 drop-shadow-none hover:bg-black/3"
              }`}
              onClick={() => {
                setMode("search");
                setModel("deepseek/deepseek_v3");
              }}
            >
              <Search />
              Search
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
