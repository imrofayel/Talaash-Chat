"use client";

import { useState } from "react";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type SearchResult = {
	title: string;
	url: string;
	publishedDate?: string;
	author?: string;
	text?: string;
	highlights?: string[];
	summary?: string;
	image?: string;
	favicon?: string;
	subpages?: SearchResult[];
};

type SearchResultsProps = {
	results: SearchResult[];
	className?: string;
};

const formatDate = (dateString?: string) => {
	if (!dateString) return "";
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch (e) {
		console.log(e);
		return "";
	}
};

const ResultCard = ({ result }: { result: SearchResult }) => {
	const [expanded, setExpanded] = useState(false);
	const [showSubpages, setShowSubpages] = useState(false);

	const hasSubpages = result.subpages && result.subpages.length > 0;

	return (
		<div className="bg-white rounded-xl p-4 mb-4 border border-gray-200/60 shadow-sm">
			<div className="flex items-start gap-3">
				{result.favicon && (
					<Image
						src={result.favicon}
						alt=""
						width={20}
						height={20}
						className="mt-1 rounded-sm"
						onError={(e) => {
							// Next Image doesn't support style.display = "none" directly
							// Using a class to hide the image on error
							const target = e.target as HTMLImageElement;
							target.classList.add("hidden");
						}}
					/>
				)}
				<div className="flex-1">
					<div className="flex justify-between items-start">
						<h3 className="font-medium text-lg text-gray-900 mb-1">
							{result.title}
						</h3>
						<a
							href={result.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-800 ml-2"
						>
							<ExternalLink size={16} />
						</a>
					</div>
					<div className="text-sm text-gray-500 mb-2">
						{result.author && <span className="mr-2">{result.author}</span>}
						{result.publishedDate && (
							<span>{formatDate(result.publishedDate)}</span>
						)}
					</div>

					{result.summary && (
						<div className="mb-3 text-gray-700">
							<Markdown>{result.summary}</Markdown>
						</div>
					)}

					{result.highlights && result.highlights.length > 0 && (
						<div className="mb-3">
							<div className="text-sm font-medium text-gray-700 mb-1">
								Highlights:
							</div>
							<ul className="list-disc pl-5 space-y-1">
								{result.highlights.map((highlight) => (
									<li key={highlight} className="text-gray-600">
										<Markdown>{highlight}</Markdown>
									</li>
								))}
							</ul>
						</div>
					)}

					{result.text && (
						<div className="relative">
							<div
								className={cn(
									"text-gray-700 overflow-hidden",
									!expanded && "max-h-24",
								)}
							>
								<Markdown>
									{expanded ? result.text : `${result.text.slice(0, 200)}...`}
								</Markdown>
							</div>
							{result.text.length > 200 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setExpanded(!expanded)}
									className="mt-1 text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
								>
									{expanded ? (
										<>
											<ChevronUp className="h-4 w-4 mr-1" /> Show less
										</>
									) : (
										<>
											<ChevronDown className="h-4 w-4 mr-1" /> Read more
										</>
									)}
								</Button>
							)}
						</div>
					)}

					{hasSubpages && (
						<div className="mt-3">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowSubpages(!showSubpages)}
								className="text-gray-700"
							>
								{showSubpages ? "Hide" : "Show"} related pages (
								{result.subpages?.length})
								{showSubpages ? (
									<ChevronUp className="ml-1 h-4 w-4" />
								) : (
									<ChevronDown className="ml-1 h-4 w-4" />
								)}
							</Button>

							{showSubpages && (
								<div className="mt-3 pl-4 border-l-2 border-gray-200">
									{result.subpages?.map((subpage) => (
										<div key={subpage.url} className="mb-4">
											<div className="flex justify-between items-start">
												<h4 className="font-medium text-gray-900">
													{subpage.title}
												</h4>
												<a
													href={subpage.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:text-blue-800 ml-2"
												>
													<ExternalLink size={14} />
												</a>
											</div>
											{subpage.summary && (
												<div className="text-sm text-gray-700 mt-1">
													<Markdown>{subpage.summary}</Markdown>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export function SearchResults({ results, className }: SearchResultsProps) {
	if (!results || results.length === 0) {
		return (
			<div className={cn("p-4 text-center text-gray-500", className)}>
				No results found. Try a different search query.
			</div>
		);
	}

	return (
		<div className={cn("space-y-4", className)}>
			{results.map((result) => (
				<ResultCard key={result.url} result={result} />
			))}
		</div>
	);
}
