import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

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
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="light">
					{children}
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
