import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Affilion — CRM + Трекер",
  description: "Керуйте партнерами та трафіком в одному місці",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const signedIn = cookieStore.has("access_token");

  return (
    <html lang="uk">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-6xl px-4">
          <Header signedIn={signedIn} />
          <main className="py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
