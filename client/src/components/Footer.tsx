"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="mt-24 border-t border-neutral-300 bg-[#fdfdfc] text-neutral-600 text-xs font-serif">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand & Copyright */}
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-serif font-bold text-neutral-900 tracking-tight">
              The Golang Chronicle
            </h3>
            <p className="text-[11px] text-neutral-400">
              © {new Date().getFullYear()} The Golang Chronicle. Bound in enduring code. All rights reserved.
            </p>
          </div>

          {/* Links & Back to top */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-600">
            <Link href="/about" className="hover:text-black hover:underline">
              About
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/archive" className="hover:text-black hover:underline">
              Archives
            </Link>
            <span className="text-neutral-300">•</span>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("RSS Feed subscribed!"); }}
              className="hover:text-black hover:underline"
            >
              RSS Feed
            </a>
            <span className="text-neutral-300">•</span>
            <Link href="/admin" className="hover:text-black hover:underline font-sans">
              Admin Portal
            </Link>
            <span className="text-neutral-300">•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-black hover:underline inline-flex items-center space-x-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
