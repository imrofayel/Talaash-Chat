"use client";

import {
	PromptInput,
	PromptInputActions,
	PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chat";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getModelIcon } from "@/lib/provider-icons";
import { useTheme } from "next-themes";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";

type ModelOption = {
	name: string;
	slug: string;
};

export function ChatInput() {
	const [input, setInput] = useState<string>("");
	const {
		isStreaming,
		setIsStreaming,
		addMessage,
		updateLastMessage,
		mode,
		model,
		setModel,
	} = useChatStore();

	const abortController = useRef<AbortController | null>(null);
	const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
	const [isWebSearching, setIsWebSearching] = useState(false);

	useEffect(() => {
		const fetchModels = async () => {
			try {
				const response = await fetch("/api/models");
				if (!response.ok) {
					throw new Error(`Failed to fetch models: ${response.status}`);
				}
				const data = await response.json();

				if (data && data.models && Array.isArray(data.models)) {
					const modelOptions = data.models.map((model: ModelOption) => {
						const slug = model.slug;
						const name = model.name;

						return { slug, name };
					});

					setModelOptions(modelOptions);
				} else {
					console.warn("Invalid models data structure:", data);
					setModelOptions([
						{
							name: "Talaash",
							slug: "mistralai/mistral-7b-instruct:free",
						},
					]);
				}
			} catch (error) {
				console.error("Error fetching models:", error);

				setModelOptions([
					{
						name: "Talaash",
						slug: "mistralai/mistral-7b-instruct:free",
					},
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

	function getModelNameBySlug(slug: string): string {
		const found = modelOptions.find((m) => m.slug === slug);
		return found ? found.name.replace(/\s*\(.*\)$/, "") : "Talaash"; // fallback to slug if name not found
	}

	const handleWebSearch = async () => {
		if (!input.trim() || isWebSearching || isStreaming) return;

		setIsWebSearching(true);
		addMessage(input.trim(), "user", "Web Search");

		const searchQuery = input.trim();
		setInput("");

		addMessage("Searching the web...", "assistant", "Web Search");

		try {
			const response = await fetch("/api/websearch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					query: searchQuery,
				}),
			});

			// Check if response is HTML (error page) instead of JSON
			const contentType = response.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				const text = await response.text();
				console.error("Non-JSON response:", text);
				throw new Error("API endpoint not found or misconfigured");
			}

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData?.error || `HTTP Error: ${response.status}`);
			}

			const data = await response.json();
			updateLastMessage(data.result || "No results found.");
		} catch (error: unknown) {
			console.error("Web Search Error:", error);
			let errorMessage = "Sorry, web search failed!";

			if (error instanceof Error) {
				if (error.message.includes("API endpoint not found")) {
					errorMessage =
						"Web search API endpoint not configured. Please create `/api/websearch/route.ts`";
				} else if (error.message.includes("Unexpected token")) {
					errorMessage =
						"API endpoint returned HTML instead of JSON. Check your route configuration.";
				} else {
					errorMessage = `Web search error: ${error.message}`;
				}
			}

			updateLastMessage(errorMessage);
		} finally {
			setIsWebSearching(false);
		}
	};

	const handleSubmit = async () => {
		if (!input.trim() || isStreaming) return;

		abortController.current?.abort();
		abortController.current = new AbortController();

		addMessage(input.trim(), "user", getModelNameBySlug(model));

		setInput("");

		setIsStreaming(true);
		addMessage("", "assistant", getModelNameBySlug(model));

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

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData?.error || `HTTP Error: ${response.status}`);
			}
			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let accumulatedText = "";

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });

					try {
						const jsonData = JSON.parse(chunk);
						if (jsonData.content) {
							accumulatedText = jsonData.content;
							updateLastMessage(accumulatedText);
						}
					} catch {
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
			updateLastMessage(`Sorry, something went wrong!

\`\`\`bash
${error}
\`\`\`

`);
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

	const { theme } = useTheme();

	const handleNewChat = () => {
		useChatStore.setState({ messages: [] });
	};

	return (
		<div className="md:w-[80%] w-[97%] absolute bottom-4 flex flex-col justify-center items-center z-20">
			<PromptInput
				value={input}
				onValueChange={handleValueChange}
				isLoading={isStreaming || isWebSearching}
				onSubmit={handleSubmit}
				className="relative flex h-full border cursor-text dark:bg-emerald-950/50 backdrop-blur-2xl bg-white drop-shadow-xs w-full justify-center border-[#899c8d] dark:border-white/10 items-center transition-all duration-500 focus-within:shadow-none hover:shadow-none p-1 rounded-[30px]"
			>
				<PromptInputTextarea
					placeholder="What's up?"
					className="t-body-chat block w-full resize-none overflow-y-hidden whitespace-pre-wrap bg-transparent text-[#435346] dark:text-white/90 outline-none placeholder:opacity-100 !border-none placeholder:text-[#435346] placeholder:!text-[21px] !text-[20px] dark:placeholder:text-white/85"
					rows={2}
				/>

				{/* Web Search Button */}
				<Button
					size="icon"
					aria-label="Web search"
					className={cn(
						"rounded-full z-50 cursor-pointer transition-all duration-600 shadow-none font-semibold disabled:opacity-50 bg-[#e5f0df] hover:bg-[#d5e0cf] border !text-[#435346] dark:!text-white/80 dark:bg-emerald-900/50 dark:border-white/10 border-[#899c8d] mr-2",
					)}
					onClick={handleWebSearch}
					disabled={!input.trim() || isWebSearching || isStreaming}
				>
					{isWebSearching ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.5em"
							viewBox="0 0 24 24"
							className="scale-110"
						>
							<title>Searching</title>
							<path
								fill="#73c496"
								d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"
							>
								<animateTransform
									attributeName="transform"
									dur="0.75s"
									repeatCount="indefinite"
									type="rotate"
									values="0 12 12;360 12 12"
								/>
							</path>
						</svg>
					) : (
						<Search className="h-5 w-5" />
					)}
				</Button>

				<Button
					size="icon"
					aria-label={isStreaming ? "Stop response" : "Send message"}
					className={cn(
						"rounded-full z-50 cursor-pointer transition-all duration-600 shadow-none font-semibold disabled:opacity-100 bg-[#e5f0df] hover:bg-[#e5f0df] border !text-[#435346] dark:!text-white/80 dark:bg-emerald-900/50 dark:border-white/10 border-[#899c8d]",
					)}
					onClick={isStreaming ? handleStop : handleSubmit}
					disabled={!isStreaming && !input.trim()}
				>
					{isStreaming ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="2em"
							viewBox="0 0 24 24"
							className="scale-110"
						>
							<title>Loading</title>
							<path
								fill="#73c496"
								d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"
							>
								<animateTransform
									attributeName="transform"
									dur="0.75s"
									repeatCount="indefinite"
									type="rotate"
									values="0 12 12;360 12 12"
								/>
							</path>
						</svg>
					) : (
						<div className="i-solar:arrow-up-linear text-[24px] hover:-top-0.5 relative" />
					)}
				</Button>
			</PromptInput>

			<PromptInputActions className="flex h-[32px] w-full justify-items-start items-start gap-2 !px-1 !my-2">
				<div className="flex items-start justify-between flex-wrap w-full gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild disabled={!isModelSelectionEnabled}>
							<Button
								variant="ghost"
								aria-label="Select Model"
								disabled={!isModelSelectionEnabled}
								className={`max-h-fit w-auto gap-1.5  text-[#435346] hover:bg-[#fcf8f2] text-[17px] hover:text-[#435346] font-normal [&_svg]:!size-[18px] cursor-pointer rounded-xl drop-shadow-xs !bg-[#e5f0df] dark:!bg-emerald-950 dark:border-white/10 dark:text-white/90 border-[#899c8d] border !py-1 !px-2 !pl-2.5 ${
									isModelSelectionEnabled ? "opacity-100" : "opacity-30"
								}`}
							>
								{/** biome-ignore lint/performance/noImgElement: <> */}
								<img
									src={getModelIcon(getModelNameBySlug(model), theme)}
									alt="Provider Icon"
									width="20px"
									className={cn(
										(getModelIcon(getModelNameBySlug(model), theme).includes(
											"deepseek",
										) ||
											getModelIcon(getModelNameBySlug(model), theme).includes(
												"qwen",
											) ||
											getModelIcon(getModelNameBySlug(model), theme).includes(
												"meta",
											)) &&
											"w-[23px]",
									)}
								/>
								{getModelNameBySlug(model)}
								<ChevronDown className="h-3 w-3" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="rounded-2xl overflow-auto dark:!bg-emerald-950 dark:border-white/10 dark:text-white/90 border-[#899c8d] border  bg-white/90 sm:mx-0 mx-3 backdrop-blur-3xl shadow-none drop-shadow-xs text-[17px] text-[#435346]"
							style={{ maxHeight: "200px" }}
						>
							{modelOptions.map((modelOption) => (
								<DropdownMenuItem
									key={modelOption.slug}
									onClick={() => setModel(modelOption.slug)}
									disabled={!isModelSelectionEnabled}
									className="hover:!bg-[#e5f0df] dark:!bg-emerald-950 dark:border-white/10 dark:!text-white/90 hover:border hover:border-[#899c8d] hover:!text-[#435346] dark:hover:!bg-emerald-900/50 rounded-xl"
								>
									{/* getModelIcon */}
									{
										<div className="flex items-center gap-2">
											{/** biome-ignore lint/performance/noImgElement: <> */}
											<img
												src={getModelIcon(modelOption.name, theme)}
												alt="Provider Icon"
												width="20px"
												className={cn(
													(getModelIcon(modelOption.name, theme).includes(
														"deepseek",
													) ||
														getModelIcon(modelOption.name, theme).includes(
															"qwen",
														) ||
														getModelIcon(modelOption.name, theme).includes(
															"meta",
														)) &&
														"w-[23px]",
												)}
											/>
											{modelOption.name.replace(/\s*\(.*\)$/, "")}
										</div>
									}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<div className="flex justify-start px-2 mb-3">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button
									type="button"
									className="max-h-fit w-auto gap-1.5  text-[#435346] hover:bg-[#fcf8f2] text-[17px] hover:text-[#435346] font-normal [&_svg]:!size-[18px] cursor-pointer rounded-xl drop-shadow-xs !bg-[#e5f0df] dark:!bg-emerald-950 dark:border-white/10 dark:text-white/90 border-[#899c8d] border items-center !py-1 !px-2 !pl-2.5 flex"
								>
									<div className="i-solar:chat-square-line-duotone text-[20px]" />
									New Chat
								</button>
							</AlertDialogTrigger>
							<AlertDialogContent className="bg-white/80 backdrop-blur-2xl dark:!bg-emerald-900/50 border border-[#899c8d] rounded-3xl shadow-none dark:border-white/10">
								<AlertDialogHeader>
									<AlertDialogTitle className="text-[#435346] fraunces text-2xl dark:text-white/85">
										New conversation?
									</AlertDialogTitle>
									<AlertDialogDescription className="text-[#435346] text-base dark:text-white/70">
										This will clear the current chat history and start fresh.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel className="bg-transparent border border-[#899c8d] drop-shadow-none rounded-2xl !shadow-none dark:border-white/20 text-[#435346] dark:text-white/85 hover:opacity-80 text-base">
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleNewChat}
										className="bg-[#5e7e5f] text-white hover:opacity-90 drop-shadow-none rounded-2xl !shadow-none dark:border-white/20 dark:text-white/85  text-base"
									>
										Confirm
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>

					{/* Image Generator - Disabled for now due to cost of API */}

					{/* <Link href="/imagine">
						<Button
							variant="ghost"
							aria-label="Select Model"
							className={`h-8 w-auto gap-1 bg-[#fcf8f2] text-[#435346] border p-1 !px-2 hover:bg-[#fcf8f2]  text-[17px] hover:text-[#435346] font-normal [&_svg]:!size-[18px]!cursor-pointer rounded-xl`}
						>
							Image Generator
						</Button>
					</Link> */}
				</div>
			</PromptInputActions>
		</div>
	);
}
