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
    interface Source {
      title: string | null;
      url: string;
      summary: string;
      icon?: string;
      author?: string;
    }
    let sources: Source[] = []; // Define sources here

    // If in search mode, fetch search results and enhance the prompt
    if (mode === "search" && process.env.EXA_API_KEY) {
      try {
        const searchResults = await exa.searchAndContents(message, {
          highlights: true,
          summary: true,
          // livecrawl: "always",
          // numResults: 5,
          // type: "neural",
          // useAutoprompt: true
        });

        // Format search results for the AI
        const formattedResults = searchResults.results
          .map((result, index) => {
            return `Source ${index + 1}: ${result.title}\nURL: ${result.url}\nSummary: ${result.summary ? result.summary : ""}\nHighlights: ${(result.highlights ? result.highlights : []).join("\n")}\n`;
          })
          .join("\n");

        // Extract sources for the response
        sources = searchResults.results.map((result) => ({
          title: result.title,
          url: result.url,
          summary: result.summary ? result.summary : "",
          icon: result.favicon,
          author: result.author,
        }));

        // Create enhanced system prompt with search context
        systemPrompt = `You are a helpful AI assistant with web search capabilities. 
        You have searched the web for: "${message}"
        
        Here are the search results:\n${formattedResults}\n\n
        Based on these search results, provide a comprehensive and accurate response in a causal normal way. and put the accurate information in your own words. dont add too much gaps between things, it should be smooth, concise and clear and in paragraphs format only dont add headings or stuff. 
        Include relevant information from the search results. Dont mention sources in the paraphrased response. It should be in flow, professional way.
        If the search results don't contain enough information to answer the query, acknowledge this limitation.
        `;
      } catch (error) {
        console.error("Search API Error:", error);
        // If search fails, fall back to regular chat mode
        systemPrompt =
          "Just say web search is failed. YOU DONT HAVE TO REPLY TO ANY QUERY USER ASKED JUSR SAY Server is busy, try later.";
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
      max_tokens: 2048,
      // temperature: 0.6,
      // top_p: 1,
      // frequency_penalty: 2,
      // presence_penalty: 1,
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of response) {
            if (part.choices?.[0]?.delta?.content) {
              const chunk = part.choices[0].delta.content;
              controller.enqueue(encoder.encode(chunk));
            }
          }

          // Send sources at the end
          if (sources && sources.length > 0) {
            controller.enqueue(encoder.encode(JSON.stringify({ sources })));
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
