"use client";

import { PromptInput, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Square, ArrowUp } from "lucide-react";
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
    // setMode,
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
      let accumulatedText = "";

      try {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          try {
            // Check if the chunk is a valid JSON (for sources)
            const jsonData = JSON.parse(chunk);
            if (jsonData.content) {
              accumulatedText = jsonData.content;
              updateLastMessage(accumulatedText);
            }
          } catch {
            // If not valid JSON, treat as text chunk
            accumulatedText += chunk;
            updateLastMessage(accumulatedText);
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
    "deepseek/deepseek-chat:free",
    "google/gemini-exp-1206:free",
    "google/gemini-2.0-pro-exp-02-05:free",
    "google/gemini-2.0-flash-thinking-exp:free",
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "google/gemini-flash-1.5-8b-exp",
    // "deepseek/deepseek-r1-zero:free",
    // "deepseek/deepseek-r1:free",
    "google/gemma-3-4b-it:free",
    "google/gemma-3-12b-it:free",
    "qwen/qwq-32b:free",
    "nousresearch/deephermes-3-llama-3-8b-preview:free",
    "qwen/qwen2.5-vl-72b-instruct:free",
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
    "mistralai/mistral-7b-instruct:free",
    // "microsoft/phi-3-mini-128k-instruct:free",
    // "microsoft/phi-3-medium-128k-instruct:free",
    // "meta-llama/llama-3-8b-instruct:free",
    // "openchat/openchat-7b:free",
    // "meta-llama/llama-3.3-70b-instruct:free",
    // "sophosympatheia/rogue-rose-103b-v0.2:free"
  ];

  const isModelSelectionEnabled = mode === "chat";

  return (
    <div className="sm:w-[60%] w-full absolute bottom-4 flex flex-col justify-center items-center">
      <PromptInput
        value={input}
        onValueChange={handleValueChange}
        isLoading={isStreaming}
        onSubmit={handleSubmit}
        className="relative flex h-full border cursor-text bg-[#fcf8f2] w-full justify-center items-center transition-all duration-500 focus-within:shadow-none hover:shadow-none rounded-[30px]"
      >
        <PromptInputTextarea
          placeholder="Talk with Raya!"
          className="t-body-chat block w-full resize-none overflow-y-hidden whitespace-pre-wrap bg-transparent text-primary-700 outline-none placeholder:opacity-100 !border-none placeholder:text-[#c4b7a4] placeholder:!text-[26px] placeholder:italic italic !text-[26px]"
          rows={2}
        />

        <Button
          size="icon"
          aria-label={isStreaming ? "Stop response" : "Send message"}
          className={cn(
            "rounded-full transition-all duration-600 shadow-none font-semibold !text-gray-950 disabled:opacity-100",
            isStreaming ? "[&_svg]:!size-5 bg-[#faf3ea] hover:bg-[#faf3ea]" : "[&_svg]:!size-5.5",

            input.trim() === ""
              ? "bg-[#faf3ea] !text-black/80"
              : "bg-[#038247] hover:bg-[#038247] !text-white"
          )}
          onClick={isStreaming ? handleStop : handleSubmit}
          disabled={!isStreaming && !input.trim()}
        >
          {isStreaming ? <Square className="[&_svg]:!size-5" /> : <ArrowUp />}
        </Button>
      </PromptInput>

      <PromptInputActions className="flex h-[32px] w-full justify-items-start items-start gap-2 !px-1 !my-2">
        <div className="flex items-start flex-wrap gap-x-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!isModelSelectionEnabled}>
              <Button
                variant="ghost"
                aria-label="Select Model"
                disabled={!isModelSelectionEnabled}
                className={`h-8 w-auto gap-1 bg-white text-[#0d3c26] border p-1 !px-2 hover:bg-white  text-[17px] font-normal [&_svg]:!size-[18px]cursor-pointer rounded-xl ${
                  isModelSelectionEnabled ? "opacity-100" : "opacity-30"
                }`}
              >
                {model.split("/").pop()}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[255px] rounded-xl overflow-auto bg-white/60 backdrop-blur-3xl shadow-none text-[16px] text-[#0d3c26]"
              style={{ maxHeight: "200px" }}
            >
              {modelOptions.map((modelOption) => (
                <DropdownMenuItem
                  key={modelOption}
                  onClick={() => setModel(modelOption)}
                  disabled={!isModelSelectionEnabled}
                  className="hover:!bg-green-50"
                >
                  {modelOption}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PromptInputActions>
    </div>
  );
}
