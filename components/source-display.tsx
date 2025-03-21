"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

type Source = {
  title: string;
  url: string;
  summary?: string;
  icon?: string;
};

type SourceDisplayProps = {
  sources?: Source[];
};

export function SourceDisplay({ sources }: SourceDisplayProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Sources:</h4>
      <ul className="space-y-3">
        {sources.map((source, index) => (
          <li key={index} className="bg-white rounded-xl p-3 border border-gray-200/60 shadow-sm">
            <div className="flex items-start gap-3">
              <Image
                src={
                  source.icon ||
                  `https://www.google.com/s2/favicons?sz=32&domain=${new URL(source.url).hostname}`
                }
                alt="Favicon"
                width={40}
                height={40}
                className="mt-1 rounded-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.classList.add("hidden");
                }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {source.title}
                    <ExternalLink size={16} className="inline-block ml-1" />
                  </a>
                </div>
                {source.summary && <p className="text-sm text-gray-700 mt-1">{source.summary}</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
