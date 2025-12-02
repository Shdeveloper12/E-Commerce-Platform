import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/toaster";
import Navber from "@/components/ui/navber";
import Footer from "@/components/ui/footer";
import Carousel from "@/components/ui/carousel";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartCompareProvider } from "@/components/providers/cart-compare-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechBazar - Best Tech Products in Bangladesh",
    template: "%s | TechBazar"
  },
  description:
    "Shop the latest laptops, desktops, computer components, gaming gear, and tech accessories at TechBazar. Best prices in Bangladesh with fast delivery.",
  keywords: [
    "TechBazar",
    "Computer Shop Bangladesh",
    "Laptop Price Bangladesh",
    "Gaming PC Bangladesh",
    "Computer Components",
    "Graphics Card",
    "Processor",
    "RAM",
    "SSD",
    "Gaming Laptop",
    "Desktop PC",
    "Tech Store Bangladesh",
    "Online Computer Store",
  ],
  authors: [{ name: "TechBazar Team" }],
  creator: "TechBazar",
  publisher: "TechBazar",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "TechBazar - Best Tech Products in Bangladesh",
    description: "Shop laptops, desktops, gaming gear, and computer components at the best prices in Bangladesh",
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: "TechBazar",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechBazar - Best Tech Products in Bangladesh",
    description: "Shop laptops, desktops, gaming gear, and computer components at the best prices",
    creator: "@techbazar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'MVf22Yo3mo_5taf3iugXVxFnlo0S55WBW63qwX6jr_o',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Navber />
            <SpeedInsights />
            <main className="grow bg-gray-100 pt-[60px] lg:pt-0">{children}</main>
            <Footer />
          </div>
          <CartCompareProvider />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
