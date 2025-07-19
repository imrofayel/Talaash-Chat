import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function stripMarkdown(text: string): string {
	return text
		.replace(/```[\s\S]*?```/gs, "Code Block") // Code blocks
		.replace(/---/g, "") // Horizontal rules
		.replace(/\*\*(.*?)\*\*/g, "$1") // Bold
		.replace(/\*(.*?)\*/g, "$1") // Italic
		.replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
		.replace(/`(.*?)`/g, "$1") // Code
		.replace(/#{1,6}\s?(.*)/g, "$1") // Headers
		.replace(/>\s?(.*)/g, "$1") // Block quotes
		.replace(/\n\s*[-*+]\s/g, "\n"); // List items
}

export function filter_free_models(jsonData: {
	// biome-ignore lint/suspicious/noExplicitAny: <Todo::Add Types>
	data: { models: any[] };
	// biome-ignore lint/suspicious/noExplicitAny: <>
}): any[] {
	// biome-ignore lint/suspicious/noExplicitAny: <>
	const freeModels: any[] = [];

	if (!jsonData || !jsonData.data || !Array.isArray(jsonData.data.models)) {
		console.error(
			"Invalid JSON structure. Expected 'data' and 'models' keys with an array.",
		);
		return [];
	}

	const models = jsonData.data.models;

	for (const model of models) {
		if (model.endpoint?.pricing) {
			const pricing = model.endpoint.pricing;
			const isReasoning =
				model.reasoning_config !== null && model.reasoning_config !== undefined;

			const isFree =
				pricing.prompt === "0" &&
				pricing.completion === "0" &&
				pricing.request === "0" &&
				model.name.includes("free");

			if (isFree && !isReasoning) {
				freeModels.push(model);
			}
		}
	}

	console.log("Models: ", freeModels.length);

	return freeModels;
}
