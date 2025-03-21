import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ChatMessage } from "@/lib/openai";

export type MessageProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const Message = ({ children, className, ...props }: MessageProps) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

export type MessageAvatarProps = {
  src: string;
  alt: string;
  fallback?: string;
  delayMs?: number;
  className?: string;
};

const MessageAvatar = ({ src, alt, fallback, delayMs, className }: MessageAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      <AvatarImage src={src} alt={alt} />
      {fallback && <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>}
    </Avatar>
  );
};

export type MessageContentProps = {
  children: React.ReactNode;
  markdown?: boolean;
  className?: string;
  message?: ChatMessage;
} & React.ComponentProps<typeof Markdown> &
  React.HTMLProps<HTMLDivElement>;

const MessageContent = ({
  children,
  markdown = false,
  className,
  message,
  ...props
}: MessageContentProps) => {
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const sources = message?.sources || [];
  const hasSources = sources && sources.length > 0;

  // Extract citation numbers from content using regex [n]
  const citations = message?.content
    ? [
        ...new Set(
          Array.from(message.content.matchAll(/\[(\d+)\]/g)).map((match) => parseInt(match[1]))
        ),
      ]
    : [];

  const classNames = cn(
    "rounded-xl px-3 py-2 text-[17px] !bg-white  break-words leading-loose",
    className
  );

  return (
    <div className={classNames} {...props}>
      {markdown ? <Markdown>{children as string}</Markdown> : children}

      {hasSources && (
        <div className="mt-3 border-gray-200 pt-2">
          <Collapsible open={sourcesExpanded} onOpenChange={setSourcesExpanded}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-md hover:bg-white bg-white [&>svg]:!size-4.5 p-0"
              >
                {citations.length > 0 ? `Sources (${citations.length})` : "Sources"}

                {sourcesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-2">
              <div className="space-y-3">
                {sources?.map((source, index: number) => (
                  <div key={index} className=" text-base">
                    <div className="flex justify-between items-start">
                      <a className="font-normal" href={source.url}>
                        {/* <img src={source.icon}/> */}
                        {index + 1}. {source.title}
                      </a>
                      {/* <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink size={14} />
                        </a> */}
                    </div>
                    {/* {source.summary && (
                        <div className="text-gray-600 mt-1 text-xs">{source.summary}</div>
                      )} */}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
};

export type MessageActionsProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageActions = ({ children, className, ...props }: MessageActionsProps) => (
  <div className={cn("text-muted-foreground flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

export type MessageActionProps = {
  className?: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
} & React.ComponentProps<typeof Tooltip>;

const MessageAction = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: MessageActionProps) => {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { Message, MessageAvatar, MessageContent, MessageActions, MessageAction };
