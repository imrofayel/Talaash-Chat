import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
	title: "Talaash - your friendly AI.",
	description:
		"Talaash is a friendly AI that can help you with your questions. It allows your to switch between different models and chat with them for free.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<SidebarProvider>
					{children}
					<Analytics />
				</SidebarProvider>
			</body>
		</html>
	);
}
