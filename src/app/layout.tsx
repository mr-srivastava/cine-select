import type { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import "./globals.css";

const instrumentSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-body",
});

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
      <body className={cn(instrumentSans.variable, "font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
