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
  const { isStreaming, setIsStreaming, addMessage, updateLastMessage, mode, model, setModel } =
    useChatStore();

  const abortController = useRef<AbortController | null>(null);
  const [modelOptions, setModelOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models");
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.models && Array.isArray(data.models)) {
          const modelSlugs = data.models.map((model: any) => model.slug);
          setModelOptions(modelSlugs);
        } else {
          console.warn("Invalid models data structure:", data);
          // Handle the unexpected structure (e.g., set default models)
          setModelOptions([
            "deepseek/deepseek-chat:free", // some default values
            "google/gemini-exp-1206:free",
          ]);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        // Handle the error (e.g., set default models, display a message)
        setModelOptions([
          "deepseek/deepseek-chat:free", // some default values
          "google/gemini-exp-1206:free",
        ]);
      }
    };

    fetchModels();
  }, []);

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

    setInput("");

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

  const isModelSelectionEnabled = mode === "chat";

  return (
    <div className="sm:w-[60%] w-[97%] absolute bottom-4 flex flex-col justify-center items-center z-20">
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
                className={`h-8 w-auto gap-1 bg-[#fcf8f2] text-[#0d3c26] border p-1 !px-2 hover:bg-white  text-[17px] font-normal [&_svg]:!size-[18px]cursor-pointer rounded-xl ${
                  isModelSelectionEnabled ? "opacity-100" : "opacity-30"
                }`}
              >
                {model.split("/").pop()}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="rounded-xl overflow-auto bg-white/60 backdrop-blur-3xl shadow-none text-[17px] text-[#0d3c26]"
              style={{ maxHeight: "200px" }}
            >
              {modelOptions.map((modelOption) => (
                <DropdownMenuItem
                  key={modelOption}
                  onClick={() => setModel(modelOption)}
                  disabled={!isModelSelectionEnabled}
                  className="hover:!bg-[#faf3ea] rounded-lg"
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
