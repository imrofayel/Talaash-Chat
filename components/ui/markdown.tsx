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
        className
      )}
    >
      <ReactMarkdown
        components={{
          code: ({
            // node,
            inline,
            className,
            children,
            ...props
          }: MarkdownComponentProps<"code">) => {
            if (!children) return null;
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : "text";
            const content = String(children).replace(/\n$/, "");

            if (!inline && highlighter) {
              const html = highlighter.codeToHtml(content, {
                lang: lang || "text",
                theme: "github-dark",
              });

              // Use div instead of pre to avoid nesting issues
              return (
                <div
                  className="not-prose"
                  dangerouslySetInnerHTML={{
                    __html: html,
                  }}
                />
              );
            }

            return inline ? (
              <code className="rounded bg-muted px-1 py-0.5" {...props}>
                {children}
              </code>
            ) : (
              <div className="not-prose">
                <pre className="rounded-md bg-muted/50 p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
