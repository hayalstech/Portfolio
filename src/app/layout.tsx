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
  title: "DevLaunch | Hayalsew Asrat - Full-Stack Developer",
  description: "Modern full-stack web applications built by Hayalsew Asrat. Portfolio showcasing interactive dashboards, productivity tools, and utilities.",
  keywords: ["full-stack developer", "Next.js", "React", "Tailwind CSS", "web development", "Hayalsew Asrat"],
  authors: [{ name: "Hayalsew Asrat" }],
  openGraph: {
    title: "DevLaunch | Hayalsew Asrat",
    description: "Modern full-stack web applications portfolio",
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
