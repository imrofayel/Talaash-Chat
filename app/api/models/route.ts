import { filter_free_models } from "@/lib/utils";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getFreeModels() {
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			const response = await fetch(
				"https://openrouter.ai/api/frontend/models/find?max_price=0",
			);

			if (!response.ok) {
				console.log(
					`OpenRouter API error (attempt ${attempt}/${MAX_RETRIES}):`,
					response.statusText,
				);
				if (attempt === MAX_RETRIES) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				await sleep(RETRY_DELAY);
				continue;
			}

			const data = await response.json();
			console.log("Successfully fetched models on attempt", attempt);
			return filter_free_models(data);
		} catch (error) {
			console.error(`Attempt ${attempt}/${MAX_RETRIES} failed:`, error);
			if (attempt === MAX_RETRIES) {
				console.error("All retry attempts failed");
				return [];
			}
			await sleep(RETRY_DELAY);
		}
	}
	return []; // Fallback in case all retries fail
}

export async function GET() {
	try {
		const models = await getFreeModels();
		return new Response(JSON.stringify({ models }), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch models" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
