import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
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
      <body className={cn(instrumentSans.variable, cormorantGaramond.variable, "font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
