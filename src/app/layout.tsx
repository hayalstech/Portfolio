import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hayalsew Asrat | Senior Full-Stack Product Engineer",
  description:
    "Scalable SaaS & marketplace solutions: faster APIs, lower infra costs, and end-to-end MVP delivery—from wireframes to secure production launch.",
  keywords: [
    "full-stack product engineer",
    "SaaS development",
    "marketplace development",
    "Next.js",
    "React",
    "Node.js",
    "Redis caching",
    "API performance",
    "scalable architecture",
    "Hayalsew Asrat",
  ],
  authors: [{ name: "Hayalsew Asrat" }],
  openGraph: {
    title: "Hayalsew Asrat | Senior Full-Stack Product Engineer",
    description:
      "Scalable SaaS & marketplace solutions with measurable speed, cost, and delivery wins.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}
