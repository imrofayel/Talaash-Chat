import type { ChatMessage } from "@/lib/openai";
import { jsPDF } from "jspdf";

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

export function exportAsPDF(messages: ChatMessage[]) {
	if (!messages.length) return;
	const markdown = generateMarkdown(messages);

	const doc = new jsPDF({ unit: "pt", format: "a4" });
	const margin = 40;
	const maxWidth = doc.internal.pageSize.getWidth() - 80;
	let y = margin;

	doc.setFontSize(12);
	doc.text(`Chat Export - ${new Date().toLocaleDateString()}`, margin, y);
	y += 30;

	doc.setFontSize(10);
	const lines = markdown.split("\n");

	lines.forEach((line) => {
		if (y > doc.internal.pageSize.getHeight() - 60) {
			doc.addPage();
			y = margin;
		}
		const wrappedLines = doc.splitTextToSize(line || " ", maxWidth);
		wrappedLines.forEach((wrappedLine: string) => {
			doc.text(wrappedLine, margin, y);
			y += 14;
		});
	});

	doc.save(`chat-${getDate()}.pdf`);
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
