"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-invert",
        "prose-headings:text-primary-foreground prose-headings:font-semibold",
        "prose-p:text-secondary-foreground/90 prose-p:leading-relaxed",
        "prose-strong:text-primary-foreground prose-strong:font-semibold",
        "prose-code:text-primary-foreground prose-code:bg-secondary/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-pre:bg-secondary/30 prose-pre:border prose-pre:border-secondary",
        "prose-a:text-blue-400 hover:prose-a:text-blue-300",
        "prose-ul:text-secondary-foreground/90 prose-li:text-secondary-foreground/90",
        className
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
