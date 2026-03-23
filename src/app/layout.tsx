import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "PhotoBooth - Create Amazing Photo Memories",
  description: "Digital photobooth made simple. Create beautiful photo strips with custom frames and stickers",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error('Failed to resolve auth session on layout:', error);
  }

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers session={session}>
          <Navbar />
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </Providers>
      </body>
    </html>
  );
}
