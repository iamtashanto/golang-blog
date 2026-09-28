import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Castle Chronicle — Reflections on Family, Faith, Culture & History",
  description: "Reflections on family, faith, culture, and history. Chronicling ordinary days and enduring truths.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-[#e2e8f0] py-4 sm:py-8 px-2 sm:px-4 text-[#1e293b] antialiased`}>
        {/* Centered Framed Newspaper Canvas matching the reference image */}
        <div className="max-w-[1200px] mx-auto bg-white border border-[#cbd5e1] rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10">
          <Navbar />
          <main className="py-6 min-h-[600px]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
