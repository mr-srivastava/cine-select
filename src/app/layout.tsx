import type { Metadata } from "next";
import { Montserrat, Oswald } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-body" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "CineSelect — Discover Movies",
  description: "Search and explore movie details with CineSelect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(montserrat.variable, oswald.variable, "font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
