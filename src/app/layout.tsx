import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"], // tambahkan ini
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"], // tambahkan ini
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Photo Booth",
  description: "Photo Booth App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
