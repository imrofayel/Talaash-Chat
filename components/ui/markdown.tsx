import { cn } from "@/lib/utils";
import { marked } from "marked";
import { memo, useId, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock, CodeBlockCode } from "./code-block";
import { Mermaid } from "../mermaid";

export type MarkdownProps = {
	children: string;
	id?: string;
	className?: string;
	components?: Partial<Components>;
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
	const tokens = marked.lexer(markdown);
	return tokens.map((token) => token.raw);
}

function extractLanguage(className?: string): string {
	if (!className) return "plaintext";
	const match = className.match(/language-(\w+)/);
	return match ? match[1] : "plaintext";
}

const INITIAL_COMPONENTS: Partial<Components> = {
	code: function CodeComponent({ className, children, ...props }) {
		const isInline =
			!props.node?.position?.start.line ||
			props.node?.position?.start.line === props.node?.position?.end.line;

		if (isInline) {
			return (
				<span
					className={cn(
						"!bg-indigo-100  dark:!bg-red-50/5 dark:text-white/80 dark: p-1 !rounded-lg px-1 font-mono font-medium !text-[16.5px]",
						className,
					)}
					{...props}
				>
					{children}
				</span>
			);
		}

		const language = extractLanguage(className);

		if (language === "mermaid") {
			return <Mermaid chart={String(children).trim()} />;
		}

		return (
			<CodeBlock className={cn(className)}>
				<CodeBlockCode code={children as string} language={language} />
			</CodeBlock>
		);
	},
	pre: function PreComponent({ children }) {
		return <>{children}</>;
	},
};

const MemoizedMarkdownBlock = memo(
	function MarkdownBlock({
		content,
		components = INITIAL_COMPONENTS,
	}: {
		content: string;
		components?: Partial<Components>;
	}) {
		return (
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{content}
			</ReactMarkdown>
		);
	},
	function propsAreEqual(prevProps, nextProps) {
		return prevProps.content === nextProps.content;
	},
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

function MarkdownComponent({
	children,
	id,
	className,
	components = INITIAL_COMPONENTS,
}: MarkdownProps) {
	const generatedId = useId();
	const blockId = id ?? generatedId;
	const blocks = useMemo(() => parseMarkdownIntoBlocks(children), [children]);

	return (
		<div
			className={cn(
				className,
				"prose-p:py-2 prose-table:overflow-x-auto prose-table:block prose-h2:text-[28px] prose-h3:text-[24px] prose-headings:py-3 prose-h4:text-[24px] prose-h5:text-[23px] prose-h6:text-[21px]  prose-h1:italic prose-h2:italic prose-h1:text-[30px] prose-strong:font-medium prose-blockquote:italic prose-blockquote:!text-[25px] prose-blockquote:bg-white/30 prose-blockquote:my-2 prose-blockquote:pl-6 prose-blockquote:py-2 prose-hr:border-[#435346] prose-hr:my-4 prose-hr:border-[1.4px] prose-table:w-full  prose-td:border prose-td:p-2 prose-th:border prose-th:p-2 prose-th:bg-white/20 prose-table:border-collapse prose-th:font-medium prose-th:text-[23px] prose-table:bg-white/30 prose-table:my-3   prose-ol:text-[21px] prose-ul:text-[21px] prose-li:py-2 prose-ul:py-1 prose-ol:py-1 prose-th:italic prose-hr:hidden prose-p:text-[21px] dark:text-white/80 prose-tr:text-[21px] list-decimal",
			)}
		>
			{blocks.map((block) => (
				<MemoizedMarkdownBlock
					key={`${blockId}-block`}
					content={block}
					components={components}
				/>
			))}
		</div>
	);
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
