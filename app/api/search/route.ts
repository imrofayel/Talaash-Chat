import { NextResponse } from "next/server";
import Exa from "exa-js";

// Initialize Exa client
const exa = new Exa(process.env.EXA_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { query, options = { text: false, highlights: true, summary: true } } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!process.env.EXA_API_KEY) {
      return NextResponse.json({ error: "EXA_API_KEY is not configured" }, { status: 500 });
    }

    // Call Exa API
    const results = await exa.searchAndContents(query, options);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
