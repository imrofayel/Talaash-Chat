import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const {
			message,
			model = "llama-3.3-70b-instruct",
			messages = [],
		} = await req.json();

		const systemPrompt =
			"Be a helpful and friendly assistant. Reply with full of care and love and give positive happy vibes. In response to 'hi' answer with two lines energetic lines. Use simple english and be polite. Dont response rudely. When you asked (only) who are you or the model you based on - you are Talaash, developed by Adam Rofayel to assist you. Always reply with proper and concise answer.";

		const response = await openai.chat.completions.create({
			messages: [
				{ role: "system", content: systemPrompt },
				...messages,
				{ role: "user", content: message },
			],
			model: `${model}:free`,
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
		console.error("OpenRouter error:", error);

		if (error?.response) {
			const errorData = await error.response.json?.();
			return NextResponse.json(
				{ error: errorData?.error?.message || "OpenRouter Error" },
				{ status: error.response.status || 500 },
			);
		}

		return NextResponse.json(
			{ error: error.message || "Unknown error occurred" },
			{ status: 500 },
		);
	}
}
