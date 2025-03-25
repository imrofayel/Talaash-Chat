import { filter_free_models } from "@/lib/utils";

async function getFreeModels() {
  try {
    const response = await fetch("https://openrouter.ai/api/frontend/models/find?max_price=0");
    if (!response.ok) {
      console.log("OpenRouter API error:", response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.ok) {
      console.log("OpenRouter API response:", response.statusText);
    }
    const data = await response.json();
    const freeModels = filter_free_models(data);
    return freeModels;
  } catch (error) {
    console.error("Could not fetch models:", error);
    return [];
  }
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
    return new Response(JSON.stringify({ error: "Failed to fetch models" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.error("API Error:", error);
  }
}
