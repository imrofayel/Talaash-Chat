import type { ChatMessage } from "@/lib/openai";
import { marked } from "marked";

export function exportAsJSON(messages: ChatMessage[]) {
	if (!messages.length) return;
	const jsonData = messages.map((msg) => ({
		id: msg.id,
		message: msg.content,
		sender: msg.role === "user" ? "user" : "AI",
	}));
	downloadFile(
		JSON.stringify(jsonData, null, 2),
		`chat-${getDate()}.json`,
		"application/json",
	);
}

function generateMarkdown(messages: ChatMessage[]): string {
	return messages
		.map((msg) => {
			if (msg.role === "user") {
				return `> ${msg.content}\n`;
			} else {
				return `${msg.content}\n\n( ${msg.model || "Unknown Model"} )\n`;
			}
		})
		.join("\n");
}

export function exportAsMarkdown(messages: ChatMessage[]) {
	if (!messages.length) return;
	const markdown = generateMarkdown(messages);
	downloadFile(markdown, `chat-${getDate()}.md`, "text/markdown");
}

export async function exportAsPDF(messages: ChatMessage[]) {
	if (!messages.length) return;

	const markdown = generateMarkdown(messages);
	const html = await marked.parse(markdown);

	const htmlContent = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<title>Chat Export</title>
			<style>
				body { font-family: system-ui; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
				blockquote { border-left: 4px solid #007acc; padding-left: 20px; color: #333; background: #f9f9f9; margin: 10px 0; }
				code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
				pre { background: #2d2d2d; color: white; padding: 15px; border-radius: 5px; }
				.model { color: #666; font-size: 0.9em; text-align: right; margin-bottom: 20px; }
			</style>
		</head>
		<body>
			<h1>Chat Export - ${getDate()}</h1>
			${html}
		</body>
		</html>
	`;

	const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
	const url = URL.createObjectURL(blob);

	const printWindow = window.open(url, "_blank");
	if (printWindow) {
		printWindow.onload = () => {
			setTimeout(() => {
				printWindow.print();
				URL.revokeObjectURL(url);
			}, 100);
		};
	}
}

function downloadFile(content: string, filename: string, type: string) {
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function getDate() {
	return new Date().toISOString().slice(0, 10);
}
