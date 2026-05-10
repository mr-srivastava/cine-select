import type { Metadata } from "next";
import { Montserrat, Oswald } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-body" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cine-select.vercel.app"),
  title: {
    default: "CineSelect",
    template: "%s | CineSelect",
  },
  description: "Search and explore movie details with CineSelect.",
  openGraph: {
    title: "CineSelect",
    description: "Search and explore movie details with CineSelect.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineSelect",
    description: "Search and explore movie details with CineSelect.",
  },
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
