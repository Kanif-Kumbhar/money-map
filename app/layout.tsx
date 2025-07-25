import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Money Map",
	description: "The Odd Dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<ClerkProvider>
			<html
				lang="en"
				className="dark"
				style={{
					colorScheme: "dark",
				}}
				suppressHydrationWarning
			>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
					suppressHydrationWarning
				>
					<Toaster richColors position="bottom-right" />
					<RootProviders>{children}</RootProviders>
				</body>
			</html>
		</ClerkProvider>
	);
}
