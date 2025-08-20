import { ChatInput } from "@/components/widgets/chat-input";
import { Chat } from "@/components/chat";
import Link from "next/link";
import ThemeSwitcher from "@/components/theme-switchr";
import ExportMenu from "@/components/export-menu";
import { ShinyButton } from "@/components/magicui/shiny-button";
export default function Home() {
	return (
		<div className="h-screen w-[97%] md:w-[60%] relative mx-auto flex flex-col ">
			{/* Navbar */}
			<header
				className="italic text-3xl fraunces w-full flex justify-between items-center pt-4 pb-4 px-8 fixed top-0 left-0 
       bg-transparent  dark:bg-transparent border-b border-green-100 dark:border-b dark:border-white/20 z-50 backdrop-blur-sm"
			>
				{/* Brand */}
				<span className="!text-[#5e7e5f] dark:!text-white/85">talaash</span>

				{/* Right side */}
				<div className="flex gap-3">
					<ExportMenu />
					<ThemeSwitcher />

					<Link
						href="https://github.com/imrofayel/talaash-chat"
						target="_blank"
						className="geist font-normal text-[19px] dark:!bg-emerald-950 bg-[#e5f0df] dark:!text-white/85 flex p-1 rounded-lg justify-center items-center border gap-1 dark:border-white/10 border-[#899c8d] px-1.5"
					>
						<ShinyButton>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								viewBox="0 0 24 24"
							>
								<title>GitHub Icons</title>
								<path
									fill="currentColor"
									d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
								/>
							</svg>
							<span>Star</span>
						</ShinyButton>
					</Link>
				</div>
			</header>

			{/* Chat container (below navbar) */}
			<main className="flex flex-col flex-1 w-full mt-[88px] relative">
				{/* Chat messages scroll */}
				<div className="flex-1 overflow-y-auto pb-36">
					<Chat />
				</div>

				{/* Chat input stays pinned at bottom */}
				<div className="fixed bottom-0 left-0 w-full flex justify-center pb-4">
					<div className="w-full max-w-3xl px-4">
						<ChatInput />
					</div>
				</div>
			</main>
		</div>
	);
}
