import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

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
    <html lang="en" className="scroll-smooth bg-white">
      <body className="min-h-screen bg-white text-[#1e293b] antialiased">
        <AuthProvider>
          {/* Standard Professional Clean Container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navbar />
            <main className="py-2 min-h-[600px]">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
