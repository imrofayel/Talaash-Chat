import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      message,
      model = "mistral-7b-instruct:free",
      // mode = "chat",
      messages = [],
    } = await req.json();

    const systemPrompt =
      "Be a helpful assistant. Reply with full of care and love. Use simple english and be polite. When you asked who are you or the model you based on keep in mind You are Raya, developed by Adam Rofayel to assist you.";
    const userMessage = message;

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
      model: model + ":free",
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
