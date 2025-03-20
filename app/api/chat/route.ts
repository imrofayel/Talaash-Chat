import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Be a helpful assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "deepseek/deepseek-r1",
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
