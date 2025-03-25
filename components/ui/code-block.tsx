"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
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
        className
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

  const handleDownload = () => {
    const extension = languageExtensions[language.toLowerCase()] || language;
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
      const html = await codeToHtml(code, { lang: language, theme });
      setHighlightedHtml(html);
    }
    highlight();
  }, [code, language, theme]);

  const classNames = cn(
    "w-full overflow-x-auto text-[16px] roboto-mono leading-loose [&>pre]:px-4 [&>pre]:py-3 !backdrop-blur-none",
    className
  );

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="rounded-xl bg-[#faf3ea] backdrop-blur-3xl p-2 max-h-fit hover:bg-[#faf3ea] text-[#0d3c26]"
          title="Copy code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </g>
          </svg>
        </button>
        <button
          onClick={handleDownload}
          className="rounded-xl bg-[#faf3ea] backdrop-blur-3xl p-2 max-h-fit hover:bg-[#faf3ea] text-[#0d3c26]"
          title="Download code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5l5-5m-5 5V3"
            />
          </svg>
        </button>
      </div>
      {highlightedHtml ? (
        <div
          className={classNames}
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

function CodeBlockGroup({ children, className, ...props }: CodeBlockGroupProps) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock };
