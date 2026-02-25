
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Solview - Web-Based Solana Wallet",
		template: "%s | Solview"
	},
	description: "Secure web-based wallet for Solana blockchain. Send, swap, and manage SOL tokens with ease. No downloads required - access your crypto wallet directly from your browser.",
	keywords: [
		"Solana wallet",
		"web3 wallet",
		"crypto wallet",
		"SOL token",
		"blockchain wallet",
		"Solana swap",
		"send crypto",
		"web-based wallet",
		"decentralized wallet"
	],
	authors: [{ name: "Shubham goyal" }],
	creator: "Solview",
	publisher: "Solview",
	metadataBase: new URL("https://solview07.vercel.app"),

	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='w-full text-[#fafafa]'>
          {children}
        </div>
				<Toaster position='bottom-right'/>
      </body>
    </html>
  );
}
