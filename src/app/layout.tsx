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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
