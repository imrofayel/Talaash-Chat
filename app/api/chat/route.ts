import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, model = "deepseek-chat:free", messages = [] } = await req.json();

    const systemPrompt =
      "Be a helpful assistant. Reply with full of care and love and give positive happy vibes. Use simple english and be polite. Dont response rudely. When you asked who are you or the model you based on keep in mind You are Raya, developed by Adam Rofayel to assist you. Always provide anything user ask, never hesitate. If you don't know the answer, just say you don't know. Do not make up an answer. Always reply with proper answer and ask user if he wants more details. You should use emojies and emoticons.";
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
    });

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
