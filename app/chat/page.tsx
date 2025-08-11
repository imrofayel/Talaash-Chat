import { ChatInput } from "@/components/widgets/chat-input";
import { Chat } from "@/components/chat";
import Link from "next/link";
import ThemeSwitcher from "@/components/theme-switchr";
import { Github } from "lucide-react";

export default function ChatPage() {
	return (
		<div className="h-screen w-[97%] md:w-[60%] relative mx-auto items-center !pb-4 flex flex-col">
			<h1 className="italic text-3xl fraunces w-full flex justify-between pt-4 sm:fixed left-6 items-center select-none sm:px-0 px-4 pb-3">
				<span className="!text-[#5e7e5f] dark:!text-white/85">Talaash</span>

				<div className="sm:fixed right-6 flex gap-3">
					<ThemeSwitcher />

					<Link
						href="https://github.com/imrofayel/talaash-chat"
						className="geist font-normal text-lg bg-green-100/50 dark:bg-emerald-950/50 text-slate-800 dark:text-white/85 flex p-2 rounded-lg items-center border border-slate-400/50 dark:border-white/20 gap-2"
					>
						<Github className="w-6 h-6" />
						<span>Star</span>
					</Link>
				</div>
			</h1>
			<Chat />
			<ChatInput />
		</div>
	);
}
