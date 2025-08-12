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
				@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
				
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
				
				body { 
					font-family: 'Inter' 'Segoe UI', system-ui, sans-serif; 
					line-height: 1.6; 
					max-width: 900px; 
					margin: 0 auto; 
					padding: 40px 30px; 
					color: #1a1a1a;
					background: #ffffff;
					font-size: 14px;
					font-weight: 400;
				}
				
				h1 { 
					font-size: 28px; 
					font-weight: 600; 
					color: #0066cc; 
					margin-bottom: 8px;
					text-align: center;
					border-bottom: 2px solid #e5e7eb;
					padding-bottom: 16px;
					margin-bottom: 32px;
				}
				
				h2 { 
					font-size: 22px; 
					font-weight: 500; 
					color: #374151; 
					margin: 24px 0 12px 0; 
					border-left: 4px solid #0066cc;
					padding-left: 12px;
				}
				
				h3 { 
					font-size: 18px; 
					font-weight: 500; 
					color: #4b5563; 
					margin: 20px 0 10px 0; 
				}
				
				p { 
					margin: 12px 0; 
					text-align: justify;
				}
				
				blockquote { 
					border-left: 4px solid #0066cc; 
					padding: 16px 20px; 
					color: #1a1a1a; 
					background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
					margin: 20px 0; 
					border-radius: 0 8px 8px 0;
					box-shadow: 0 2px 4px rgba(0, 102, 204, 0.1);
					font-weight: 500;
				}
				
				blockquote p {
					margin: 0;
				}
				
				code { 
					font-family: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
					background: #f1f3f4; 
					color: #d73a49;
					padding: 3px 6px; 
					border-radius: 4px; 
					font-size: 13px;
					font-weight: 500;
					border: 1px solid #e1e4e8;
				}
				
				pre { 
					font-family: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
					background: #f6f8fa; 
					color: #24292e;
					padding: 20px; 
					border-radius: 8px; 
					margin: 20px 0;
					border: 1px solid #e1e4e8;
					box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
					line-height: 1.45;
					white-space: pre-wrap; /* Allow text wrapping */
					overflow-wrap: break-word; /* Break only very long words */
				}
				
				pre code {
					background: none;
					color: inherit;
					padding: 0;
					border: none;
					font-size: 13px;
					font-weight: 400;
					white-space: pre-wrap; /* Allow text wrapping in code blocks */
					overflow-wrap: break-word; /* Break only URLs and very long strings */
				}
				
				/* Lists */
				ul, ol { 
					margin: 16px 0; 
					padding-left: 24px; 
				}
				
				li { 
					margin: 6px 0; 
					line-height: 1.5;
				}
				
				/* Tables */
				table { 
					border-collapse: collapse; 
					width: 100%; 
					margin: 20px 0; 
					font-size: 13px;
				}
				
				th, td { 
					border: 1px solid #d0d7de; 
					padding: 12px 16px; 
					text-align: left; 
				}
				
				th { 
					background: #f6f8fa; 
					font-weight: 600;
					color: #24292f;
				}
				
				/* Model attribution styling */
				.model { 
					color: #6b7280; 
					font-size: 12px; 
					text-align: right; 
					margin: 8px 0 24px 0;
					font-style: italic;
					font-weight: 300;
					padding-top: 8px;
					border-top: 1px solid #f3f4f6;
				}
				
				/* Links */
				a {
					color: #0066cc;
					text-decoration: none;
				}
				
				a:hover {
					text-decoration: underline;
				}
				
				/* Strong and emphasis */
				strong { 
					font-weight: 600; 
					color: #111827;
				}
				
				em { 
					font-style: italic; 
					color: #4b5563;
				}
				
				/* Horizontal rule */
				hr {
					border: none;
					border-top: 2px solid #e5e7eb;
					margin: 32px 0;
				}
				
				/* Print optimizations */
				@media print {
					body { 
						max-width: none; 
						margin: 0; 
						padding: 20px;
						font-size: 12px;
					}
					
					h1 { font-size: 24px; }
					h2 { font-size: 18px; }
					h3 { font-size: 16px; }
					
					blockquote {
						break-inside: avoid;
						page-break-inside: avoid;
					}
					
					pre {
						break-inside: avoid;
						page-break-inside: avoid;
						font-size: 11px; /* Smaller font for better fitting */
						padding: 15px; /* Reduce padding */
						white-space: pre-wrap; /* Ensure wrapping in print */
						overflow-wrap: break-word; /* Only break very long words */
					}
					
					/* Ensure good contrast for printing */
					blockquote {
						background: #f9f9f9 !important;
						box-shadow: none;
					}
					
					pre {
						background: #f5f5f5 !important;
						box-shadow: none;
					}
				}
				
				@page {
					margin: 2cm;
					size: A4;
				}
			</style>
		</head>
		<body>
			<h1>Talaash Chat Export - ${getDate()}</h1>
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
