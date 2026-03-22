import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Kanit } from "next/font/google";
import Navbar from "@/components/ui/NavBar";
import AuthProvider from "@/components/ui/providers";

export const metadata: Metadata = {
  title: "Moodly",
  description: "khanakorn kositkhongchana 2026",
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
    <html lang="en">
      <body
        className={`${outfit.variable} ${kanit.variable} ${kanit.className}  antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
