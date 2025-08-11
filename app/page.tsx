// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeSwitcher from "@/components/theme-switchr";
import { AppUIPeeker } from "@/components/AppUIPeeker";

export default function LandingPage() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="geist bg-background text-foreground min-h-screen flex flex-col">
			{/* HEADER */}
			<header className="container mx-auto px-6 py-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold fraunces flex items-center gap-2">
					<div className="i-hugeicons:compass-01 w-7 h-7 text-primary" />
					Talaash
				</h1>
				<div className="flex items-center gap-4">
					{/* Go to App – now same style as View on GitHub */}
					<Link
						href="/chat"
						className="group inline-flex items-center gap-3 
                       bg-card text-foreground hover:bg-accent 
                       border border-border 
                       rounded-xl px-6 py-3 font-semibold text-sm 
                       transition-all duration-300 hover:scale-105"
					>
						<div className="i-hugeicons:message-circle-02 w-5 h-5" />
						Go to App
					</Link>
					<ThemeSwitcher />
				</div>
			</header>

			{/* MAIN CONTENT */}
			<main
				className={`flex-1 container mx-auto px-6 py-16 text-center transition-opacity duration-1000 ${
					isMounted ? "opacity-100" : "opacity-0"
				}`}
			>
				{/* HERO SECTION */}
				<section className="mb-20">
					<h2 className="text-5xl md:text-7xl font-extrabold mb-6 fraunces bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">
						A New Conversation Begins
					</h2>
					<p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
						Your elegant, open-source gateway to the world's leading AI models.
						Chat, compare, and create — all from one beautifully simple
						interface that brings the future of AI to your fingertips.
					</p>

					{/* LIVE PREVIEW */}
					<div className="flex flex-col items-center gap-8">
						<div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Experience AI Like Never Before
						</div>
						<AppUIPeeker />

						{/* Live Chat Preview */}
						<div className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border rounded-2xl p-6 shadow-2xl">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="i-hugeicons:robot w-5 h-5 text-primary" />
									<span className="font-medium">DeepSeek V3</span>
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
								</div>
								<div className="text-xs text-muted-foreground">
									Live Preview
								</div>
							</div>
							<div className="space-y-3">
								<div className="bg-muted/30 rounded-lg p-3 text-sm">
									<span className="text-muted-foreground">You:</span> How’s your
									day going?
								</div>
								<div className="bg-primary/10 rounded-lg p-3 text-sm">
									<span className="text-primary font-medium">AI:</span> Hello
									there! ✨ Hope it’s amazing! ✨
								</div>
							</div>
							<div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
								<span>Powered by OpenRouter</span>
								<div className="w-1 h-1 bg-muted-foreground rounded-full" />
								<span>Real-time responses</span>
							</div>
						</div>

						{/* STACK INFO */}
						<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
								<span>Next.js 14</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
								<span>OpenRouter Integration</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
								<span>TypeScript</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
								<span>Tailwind CSS</span>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="mb-16">
					<div className="rounded-3xl p-12 border border-primary/20 text-center">
						<h3 className="text-3xl md:text-4xl font-bold mb-6 fraunces">
							Ready to Experience the Future of AI Chat?
						</h3>
						<p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
							Join thousands of developers, researchers, and AI enthusiasts who
							have discovered the power of unified AI access. Start your
							intelligent conversation today.
						</p>

						{/* Buttons */}
						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
							<Link
								href="/chat"
								className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105"
							>
								<div className="i-hugeicons:message-circle-02 w-6 h-6" />
								Start Chatting Now
								<div className="i-hugeicons:arrow-right-02 w-5 h-5" />
							</Link>
							<a
								href="https://github.com/imrofayel/talaash-chat"
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-3 bg-card text-foreground hover:bg-accent border border-border rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105"
							>
								<div className="i-hugeicons:github w-6 h-6" />
								View on GitHub
							</a>
						</div>
					</div>
				</section>

				{/* Why Choose Talaash */}
				<section className="mb-20 text-left">
					<div className="text-center mb-16">
						<h3 className="text-4xl md:text-5xl font-bold mb-6 fraunces bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
							Why Choose Talaash?
						</h3>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Discover the advantages that make Talaash the preferred choice for
							AI enthusiasts and professionals worldwide.
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
						<div className="p-8 bg-gradient-to-br from-primary/8 via-primary/4 to-secondary/8 border border-primary/20 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative">
							<div className="flex items-center gap-4 mb-6 relative z-10">
								<div className="p-3 bg-primary/10 rounded-xl">
									<div className="i-hugeicons:layout-grid w-7 h-7 text-primary" />
								</div>
								<h4 className="text-2xl font-bold">
									Unified Access, Zero Clutter
								</h4>
							</div>
							<p className="text-muted-foreground leading-relaxed text-lg relative z-10">
								Stop juggling tabs and multiple platforms. Talaash provides a
								single, beautifully designed <strong>Next.js</strong> interface
								to interact with diverse AI models via{" "}
								<strong>OpenRouter's</strong> extensive catalog.
							</p>
							<div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary relative z-10">
								<span>OpenRouter API</span>
								<div className="w-1 h-1 bg-primary rounded-full" />
								<span>TypeScript</span>
							</div>
						</div>

						<div className="p-8 bg-gradient-to-br from-emerald-500/8 via-emerald-500/4 to-blue-500/8 border border-emerald-500/20 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative">
							<div className="flex items-center gap-4 mb-6 relative z-10">
								<div className="p-3 bg-emerald-500/10 rounded-xl">
									<div className="i-hugeicons:open-source w-7 h-7 text-emerald-600 dark:text-emerald-400" />
								</div>
								<h4 className="text-2xl font-bold">Free and Open Source</h4>
							</div>
							<p className="text-muted-foreground leading-relaxed text-lg relative z-10">
								Built for the community, by the community. Explore cutting-edge
								AI models completely free through our{" "}
								<strong>MIT-licensed</strong> codebase. Contribute to a project
								that champions open access and collaborative innovation.
							</p>
							<div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 relative z-10">
								<span>MIT Licensed</span>
								<div className="w-1 h-1 bg-emerald-500 rounded-full" />
								<span>Community Driven</span>
								<div className="w-1 h-1 bg-emerald-500 rounded-full" />
								<span>Modern Stack</span>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="mb-20">
					<h3 className="text-3xl font-bold mb-10 text-center fraunces">
						How It Works
					</h3>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="group p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 hover:from-blue-500/10 hover:to-purple-500/10 border border-blue-500/10 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
							<div className="i-hugeicons:flash-on w-8 h-8 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
							<h4 className="text-xl font-semibold mb-3">Select Your Model</h4>
							<p className="text-muted-foreground">
								Instantly switch between models like Llama 3, Mistral, and
								GPT-4o from a simple dropdown menu.
							</p>
						</div>
						<div className="group p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:from-purple-500/10 hover:to-pink-500/10 border border-purple-500/10 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
							<div className="i-hugeicons:message-circle-02 w-8 h-8 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
							<h4 className="text-xl font-semibold mb-3">
								Start Your Conversation
							</h4>
							<p className="text-muted-foreground">
								Enjoy a clean, markdown-supported chat experience with a
								familiar, modern user interface.
							</p>
						</div>
						<div className="group p-6 bg-gradient-to-br from-orange-500/5 to-red-500/5 hover:from-orange-500/10 hover:to-red-500/10 border border-orange-500/10 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
							<div className="i-hugeicons:github-01 w-8 h-8 mx-auto mb-4 text-orange-600 dark:text-orange-400" />
							<h4 className="text-xl font-semibold mb-3">
								Contribute on GitHub
							</h4>
							<p className="text-muted-foreground">
								Our codebase is open. Fork the repo, add a feature, and be a
								part of the journey.
							</p>
						</div>
					</div>
				</section>
			</main>

			{/* FOOTER - cleaned */}
			<footer className="bg-card px-6 py-12">
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
					{/* About */}
					<div className="md:col-span-2">
						<h3 className="fraunces text-2xl font-bold mb-3 flex items-center gap-2">
							<div className="i-hugeicons:compass-01 w-5 h-5 text-primary" />
							Talaash
						</h3>
						<p className="text-muted-foreground max-w-md">
							Your open-source gateway to top AI models. Modern, secure, and
							100% free — built for the community.
						</p>
					</div>

					{/* Project Links */}
					<div>
						<h4 className="font-semibold mb-3">Project</h4>
						<ul className="space-y-1 text-sm text-muted-foreground">
							<li>
								<a
									href="https://github.com/imrofayel/talaash-chat"
									className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className="i-hugeicons:github w-5 h-5" />
									View on GitHub
								</a>
							</li>
							<li className="inline-flex items-center gap-2 text-muted-foreground">
								<div className="i-hugeicons:lock-square w-5 h-5 text-primary" />
								MIT License
							</li>
							<li className="inline-flex items-center gap-2 text-muted-foreground">
								<div className="i-hugeicons:support w-5 h-5 text-primary" />
								Support:{" "}
								<a
									href="mailto:support@talaash.chat"
									className="underline hover:text-primary ml-1"
								>
									support@talaash.chat
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Footer Bottom */}
				<div className="container mx-auto flex flex-col sm:flex-row items-center justify-between py-4 text-sm text-muted-foreground mt-10">
					<span>
						&copy; {new Date().getFullYear()} Talaash. All rights reserved.
					</span>
					<span>Open source & secure AI access for everyone.</span>
				</div>
			</footer>
		</div>
	);
}
