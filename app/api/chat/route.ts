import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";
import Exa from "exa-js";

// Initialize Exa client
const exa = new Exa(process.env.EXA_API_KEY || "");

export async function POST(req: Request) {
  try {
    const {
      message,
      model = "deepseek/deepseek_v3",
      mode = "chat",
      messages = [],
    } = await req.json();

    let systemPrompt = "Be a helpful assistant.";
    const userMessage = message;
    // let sources = [];

    // If in search mode, fetch search results and enhance the prompt
    if (mode === "search" && process.env.EXA_API_KEY) {
      try {
        const searchResults = await exa.searchAndContents(message, {
          text: true,
          highlights: true,
          summary: true,
        });

        // Store sources for later use
        // const sources = searchResults.results.slice(0, 5).map((result) => ({
        //   title: result.title,
        //   url: result.url,
        //   summary: result.summary ? result.summary : ""
        // }));

        // Format search results for the AI
        const formattedResults = searchResults.results
          .slice(0, 5)
          .map((result, index) => {
            return `Source ${index + 1}: ${result.title}\nURL: ${result.url}\nSummary: ${result.summary ? result.summary : ""}\nHighlights: ${(result.highlights ? result.highlights : []).join("\n")}\n`;
          })
          .join("\n");

        // Create enhanced system prompt with search context
        systemPrompt = `You are a helpful AI assistant with web search capabilities. 
        You have searched the web for: "${message}"
        
        Here are the search results:\n${formattedResults}\n\n
        Based on these search results, provide a comprehensive and accurate response. 
        Include relevant information from the search results and cite your sources using numbers in square brackets like [1], [2], etc.
        If the search results don't contain enough information to answer the query, acknowledge this limitation.
        Format your response in a clear, readable way with proper markdown formatting.
        
        IMPORTANT: You MUST cite your sources using numbers in square brackets [1], [2], etc. after each piece of information you include from the search results.`;
      } catch (error) {
        console.error("Search API Error:", error);
        // If search fails, fall back to regular chat mode
        systemPrompt =
          "Be a helpful assistant. You were asked to search the web, but the search failed. Please respond based on your knowledge.";
      }
    }

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: model,
      stream: true,
      //   max_tokens: 2048,
      //   temperature: 1,
      //   top_p: 1,
      //   frequency_penalty: 0,
      //   presence_penalty: 0,
      //   min_p: 0,
      //   top_k: 50,
      //   repetition_penalty: 1,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const content = chunk.choices[0].delta.content;
              if (content) {
                controller.enqueue(new TextEncoder().encode(content));
              }
              if (chunk.choices[0].finish_reason) {
                break;
              }
            }
          } catch (error) {
            controller.error(error);
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
