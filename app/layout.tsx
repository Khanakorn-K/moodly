import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Kanit } from "next/font/google";
import Navbar from "@/components/ui/NavBar";
import AuthProvider from "@/components/ui/providers";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/cores/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "Moodly - บันทึกอารมณ์และเข้าใจตัวเองในทุกวัน",
    template: "%s | Moodly",
  },
  description: siteConfig.description,
  keywords: [
    "บันทึกอารมณ์",
    "ไดอารี่อารมณ์",
    "ติดตามอารมณ์",
    "วิเคราะห์อารมณ์",
    "mood tracker",
    "Moodly",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: siteConfig.name,
    title: "Moodly - บันทึกอารมณ์และเข้าใจตัวเองในทุกวัน",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/Logo.png",
        width: 992,
        height: 1070,
        alt: "Moodly",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Moodly - บันทึกอารมณ์และเข้าใจตัวเองในทุกวัน",
    description: siteConfig.description,
    images: ["/Logo.png"],
  },
  icons: {
    icon: ["/Logo.png"],
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
};

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-outfit",
});

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kanit",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <meta
        name="google-site-verification"
        content="TcywSLjr0baKqRMX6CwZ0gMBsHeIUfnXTQmEFrkqN8g"
      />
      <body
        className={`${outfit.variable} ${kanit.variable} ${kanit.className}  antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
