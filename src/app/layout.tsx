import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navber from "@/components/ui/navber";
import Footer from "@/components/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z.ai Code Scaffold - AI-Powered Development",
  description:
    "Modern E-commerce platform. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "AI development",
    "React",
  ],
  authors: [{ name: "SH Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "E-commerce Platform Scaffold",
    description: "Web development with modern React stack",
    url: "https://ecommerce-scaffold.example.com",
    siteName: "e-commerce-scaffold",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-commerce Platform Scaffold",
    description: "Web development with modern React stack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex flex-col min-h-screen">
          <Navber />
          <main className="flex-grow bg-blue-100">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
