// app/api/websearch/route.ts - Advanced Exa AI Implementation

import { NextRequest, NextResponse } from "next/server";

interface ExaSearchOptions {
	query: string;
	searchType?: "quick" | "detailed" | "news" | "academic";
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { query, searchType = "quick" }: ExaSearchOptions = body;

		if (!query) {
			return NextResponse.json({ error: "Query is required" }, { status: 400 });
		}

		if (!process.env.EXA_API_KEY) {
			return NextResponse.json(
				{ error: "EXA_API_KEY not configured in environment variables" },
				{ status: 500 },
			);
		}

		console.log(`Exa AI ${searchType} search for:`, query);

		// Configure search parameters based on type
		const searchConfig = getSearchConfig(searchType, query);

		// Step 1: Perform the search
		const searchResponse = await fetch("https://api.exa.ai/search", {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				"x-api-key": process.env.EXA_API_KEY,
			},
			body: JSON.stringify(searchConfig),
		});

		if (!searchResponse.ok) {
			const errorText = await searchResponse.text();
			console.error("Exa API search error:", errorText);

			return NextResponse.json(
				{
					error: `Exa search failed: ${searchResponse.status}`,
					details: errorText,
				},
				{ status: searchResponse.status },
			);
		}

		const searchData = await searchResponse.json();

		// Step 2: Get full content for top results if needed
		let enhancedResults = searchData.results;

		if (searchType === "detailed" && searchData.results?.length > 0) {
			const topResultIds = searchData.results.slice(0, 3).map((r: any) => r.id);

			try {
				const contentResponse = await fetch("https://api.exa.ai/contents", {
					method: "POST",
					headers: {
						accept: "application/json",
						"content-type": "application/json",
						"x-api-key": process.env.EXA_API_KEY,
					},
					body: JSON.stringify({
						ids: topResultIds,
						text: true,
						highlights: true,
						summary: true,
					}),
				});

				if (contentResponse.ok) {
					const contentData = await contentResponse.json();
					enhancedResults = mergeContentWithResults(
						searchData.results,
						contentData.contents,
					);
				}
			} catch (contentError) {
				console.warn("Content extraction failed:", contentError);
				// Continue with basic results
			}
		}

		// Step 3: Format results
		const formattedResult = formatSearchResults(query, enhancedResults);

		return NextResponse.json({ result: formattedResult });
	} catch (error: unknown) {
		console.error("Exa AI search error:", error);

		return NextResponse.json(
			{
				error: "Web search failed",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

// Helper function to get search configuration
function getSearchConfig(searchType: string, query: string) {
	const baseConfig = {
		query,
		useAutoprompt: true,
		contents: {
			text: true,
			highlights: true,
			summary: true,
		},
	};

	switch (searchType) {
		case "news":
			return {
				...baseConfig,
				type: "neural",
				category: "news",
				numResults: 8,
				startCrawlDate: new Date(
					Date.now() - 7 * 24 * 60 * 60 * 1000,
				).toISOString(), // Last 7 days
			};

		case "academic":
			return {
				...baseConfig,
				type: "neural",
				category: "research paper,pdf",
				numResults: 5,
				startCrawlDate: "2020-01-01T00:00:00.000Z",
			};

		case "detailed":
			return {
				...baseConfig,
				type: "neural",
				numResults: 6,
				startCrawlDate: "2022-01-01T00:00:00.000Z",
			};

		default: // quick
			return {
				...baseConfig,
				type: "neural",
				numResults: 4,
				startCrawlDate: "2023-01-01T00:00:00.000Z",
			};
	}
}

// Helper function to merge content with search results
function mergeContentWithResults(searchResults: any[], contents: any[]) {
	const contentMap = new Map();
	contents.forEach((content) => {
		contentMap.set(content.id, content);
	});

	return searchResults.map((result) => {
		const content = contentMap.get(result.id);
		if (content) {
			return {
				...result,
				text: content.text || result.text,
				highlights: content.highlights || result.highlights,
				summary: content.summary || result.summary,
			};
		}
		return result;
	});
}

// Helper function to format search results
function formatSearchResults(query: string, results: any[]) {
	if (!results || results.length === 0) {
		return `No results found for "${query}".`;
	}

	// Pick the first (most relevant) result
	const top = results[0];

	let output = `🔍 **Top result for:** "${query}"\n\n`;
	output += `[${top.title}](${top.url})\n`;

	if (top.summary) {
		output += `\n${top.summary}`;
	} else if (top.highlights?.length) {
		output += `\n${top.highlights[0]}`;
	}

	return output.trim();
}

export async function GET() {
	return NextResponse.json({
		message: "Exa AI Web Search API",
		methods: ["POST"],
		parameters: {
			query: "string (required)",
			searchType:
				"quick | detailed | news | academic (optional, default: quick)",
		},
	});
}
