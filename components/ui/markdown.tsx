"use client";

import React, { ComponentProps, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Highlighter } from "shiki";

interface MarkdownProps {
  children: string;
  className?: string;
  highlighter: Highlighter | null;
}

type ComponentType = "p" | "code";
type MarkdownComponentProps<T extends ComponentType> = ComponentProps<T> & {
  // node?: any;
  inline?: boolean;
  children?: ReactNode;
};

export function Markdown({ children, className, highlighter }: MarkdownProps) {
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
        "[&_p_code]:inline [&_p_code]:bg-secondary/50 [&_p_code]:rounded",
        className
      )}
    >
      <ReactMarkdown
        components={{
          p: ({ children, ...props }: MarkdownComponentProps<"p">) => <p {...props}>{children}</p>,
          code: ({ inline, className, children, ...props }: MarkdownComponentProps<"code">) => {
            if (!children) return null;

            // Handle inline code blocks
            if (inline) {
              return (
                <code
                  {...props}
                  className="inline-code !inline bg-secondary/50 px-1 py-0.5 rounded"
                >
                  {children}
                </code>
              );
            }

            // Handle block code with syntax highlighting
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : "text";
            const content = String(children).replace(/\n$/, "");

            if (highlighter) {
              return (
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlighter.codeToHtml(content, {
                      lang: lang || "text",
                      theme: "github-dark",
                    }),
                  }}
                />
              );
            }

            // Fallback for block code without syntax highlighting
            return (
              <pre className="rounded-md bg-muted/50 p-4 overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
