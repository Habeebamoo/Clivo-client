import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: {
    default: "Clivo",
    template: "%s | Clivo",
  },
  description: "Where Simple Stories Find Their Voices. Discover articles, insights, and stories from writers around the world.",
  keywords: ["Clivo", "blog", "articles", "writers", "storytelling", "publishing", "reading"],
  authors: [{ name: "Clivo" }],
  creator: "Clivo",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://myclivo.com"),
  openGraph: {
    title: "Clivo",
    description: "Where Simple Stories Find Their Voices. Discover articles, insights, and stories from writers around the world.",
    siteName: "Clivo",
    type: "website",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Clivo — Where Simple Stories Find Their Voices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clivo",
    description: "Where Simple Stories Find Their Voices.",
    images: ["/banner.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
