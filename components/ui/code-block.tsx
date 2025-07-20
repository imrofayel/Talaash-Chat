"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

export type CodeBlockProps = {
	children?: React.ReactNode;
	className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
	return (
		<div
			className={cn(
				"not-prose flex w-full flex-col overflow-clip bg-white border",
				"border-border text-card-foreground my-3",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export type CodeBlockCodeProps = {
	code: string;
	language?: string;
	theme?: string;
	className?: string;
} & React.HTMLProps<HTMLDivElement>;

const languageExtensions: Record<string, string> = {
	typescript: "ts",
	tsx: "tsx",
	javascript: "js",
	jsx: "jsx",
	python: "py",
	java: "java",
	csharp: "cs",
	cpp: "cpp",
	c: "c",
	ruby: "rb",
	php: "php",
	swift: "swift",
	kotlin: "kt",
	go: "go",
	rust: "rs",
	scala: "scala",
	perl: "pl",
	html: "html",
	css: "css",
	scss: "scss",
	less: "less",
	sql: "sql",
	shell: "sh",
	bash: "sh",
	powershell: "ps1",
	yaml: "yml",
	json: "json",
	markdown: "md",
	xml: "xml",
	dockerfile: "dockerfile",
	vue: "vue",
	svelte: "svelte",
	dart: "dart",
	lua: "lua",
	r: "r",
	matlab: "m",
	groovy: "groovy",
	elixir: "ex",
	haskell: "hs",
	graphql: "gql",
	solidity: "sol",
	toml: "toml",
	ini: "ini",
	env: "env",
};

const languageIconMap: Record<string, string> = {
	typescript: "i-vscode-icons:file-type-typescript",
	javascript: "i-vscode-icons:file-type-js-official",
	jsx: "i-vscode-icons:file-type-reactjs",
	python: "i-vscode-icons:file-type-python",
	java: "i-vscode-icons:file-type-java",
	csharp: "i-vscode-icons:file-type-csharp",
	cpp: "i-vscode-icons:file-type-cpp",
	c: "i-vscode-icons:file-type-c",
	ruby: "i-vscode-icons:file-type-ruby",
	php: "i-vscode-icons:file-type-php",
	swift: "i-vscode-icons:file-type-swift",
	kotlin: "i-vscode-icons:file-type-kotlin",
	go: "i-vscode-icons:file-type-go",
	rust: "i-vscode-icons:file-type-rust",
	scala: "i-vscode-icons:file-type-scala",
	perl: "i-vscode-icons:file-type-perl",
	html: "i-vscode-icons:file-type-html",
	css: "i-vscode-icons:file-type-css",
	scss: "i-vscode-icons:file-type-scss",
	less: "i-vscode-icons:file-type-less",
	sql: "i-vscode-icons:file-type-sql",
	shell: "i-vscode-icons:file-type-shell",
	bash: "i-vscode-icons:file-type-shell",
	powershell: "i-vscode-icons:file-type-powershell",
	yaml: "i-vscode-icons:file-type-yaml",
	json: "i-vscode-icons:file-type-json",
	markdown: "i-vscode-icons:file-type-markdown",
	md: "i-vscode-icons:file-type-markdown",
	xml: "i-vscode-icons:file-type-xml",
	dockerfile: "i-vscode-icons:file-type-docker",
	vue: "i-vscode-icons:file-type-vue",
	svelte: "i-vscode-icons:file-type-svelte",
	dart: "i-vscode-icons:file-type-dartlang",
	lua: "i-vscode-icons:file-type-lua",
	r: "i-vscode-icons:file-type-r",
	matlab: "i-vscode-icons:file-type-matlab",
	groovy: "i-vscode-icons:file-type-groovy",
	elixir: "i-vscode-icons:file-type-elixir",
	haskell: "i-vscode-icons:file-type-haskell",
	graphql: "i-vscode-icons:file-type-graphql",
	solidity: "i-vscode-icons:file-type-solidity",
	toml: "i-vscode-icons:file-type-toml",
	ini: "i-vscode-icons:file-type-ini",
	env: "i-vscode-icons:file-type-dotenv",
	tsx: "i-vscode-icons:file-type-reactts",
	astro: "i-vscode-icons:file-type-light-astro",
	plaintext: "i-vscode-icons:file-type-text",
};

function CodeBlockCode({
	code,
	language = "tsx",
	theme = "github-light",
	className,
	...props
}: CodeBlockCodeProps) {
	const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
	};

	const extension = languageExtensions[language.toLowerCase()] || language;

	const handleDownload = () => {
		const blob = new Blob([code], { type: "text/plain" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `code.${extension}`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};

	useEffect(() => {
		async function highlight() {
			try {
				const html = await codeToHtml(code, { lang: language, theme });
				setHighlightedHtml(html);
			} catch (error) {
				console.error("Shiki highlighting failed:", error);
				setHighlightedHtml(null);
			}
		}
		highlight();
	}, [code, language, theme]);

	const classNames = cn(
		"w-full overflow-x-auto text-[16px] leading-normal [&>pre]:px-4 [&>pre]:py-3 !backdrop-blur-none",
		className,
	);

	const iconClass =
		languageIconMap[language.toLowerCase()] || "i-solar:code-bold-duotone";

	return (
		<div className="relative group">
			<div className="bg-[#e5f0df] border-b border-r border-[#899c8d] drop-shadow-xs max-w-fit px-2 font-mono flex items-center !rounded-none gap-1 text-[18px] py-0.5 text-[#435346]">
				<div
					className={cn(
						iconClass,
						iconClass.includes("php")
							? "!text-3xl scale-110"
							: "text-2xl scale-90", // Base icon size
					)}
				/>
				code.{extension}
			</div>

			<div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					onClick={handleCopy}
					className="rounded-xl z-50 cursor-pointer transition-all duration-600 scale-95 shadow-none font-semibold disabled:opacity-100 !text-[#435346] p-1.5 border-[#899c8d] hover:bg-gray-100" // Added hover effect
					title="Copy Code"
					type="button"
				>
					<div className="i-solar:copy-linear hover:opacity-80 text-[22px]" />
				</button>
				<button
					onClick={handleDownload}
					className="rounded-xl z-50 cursor-pointer transition-all duration-600 scale-95 shadow-none font-semibold disabled:opacity-100  !text-[#435346] p-1.5 border-[#899c8d] hover:bg-gray-100" // Added hover effect
					title="Download Code"
					type="button"
				>
					<div className="i-solar:arrow-down-linear hover:opacity-80 scale-105 text-[22px]" />
				</button>
			</div>

			{highlightedHtml ? (
				<div
					className={classNames}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <>
					dangerouslySetInnerHTML={{ __html: highlightedHtml }}
					{...props}
				/>
			) : (
				<div className={classNames} {...props}>
					<pre>
						<code>{code}</code>
					</pre>
				</div>
			)}
		</div>
	);
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * CodeBlockGroup component is a utility for grouping code blocks or related elements.
 */
function CodeBlockGroup({
	children,
	className,
	...props
}: CodeBlockGroupProps) {
	return (
		<div
			className={cn("flex items-center justify-between", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock };
