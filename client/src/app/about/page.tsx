import Link from "next/link";
import { ArrowLeft, Mail, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="border-b border-neutral-300 pb-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-black font-serif"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chronicle</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mt-4">
          About The Chronicle
        </h1>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase font-sans mt-1">
          A publication of enduring engineering & software craft
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base font-serif text-neutral-800 leading-relaxed">
        <div className="h-64 sm:h-80 w-full bg-neutral-100 border border-neutral-300 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80"
            alt="Printing press & books"
            className="w-full h-full object-cover grayscale contrast-110"
          />
        </div>

        <p className="first-letter:text-5xl first-letter:font-bold first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:leading-none text-neutral-900">
          The Golang Chronicle is an independent journal dedicated to the timeless art of systems programming, concurrent Go architecture, database resilience, and clean software engineering.
        </p>

        <p>
          In an era captivated by ephemeral frameworks and restless complexity, we choose to write about the foundations that endure: clean concurrency patterns, deterministic PostgreSQL design, robust networking primitives, and thoughtful human-centric code.
        </p>

        <blockquote className="border-l-2 border-neutral-800 pl-4 py-1 italic text-neutral-600 my-6">
          &ldquo;Simplicity is prerequisite for reliability.&rdquo; — Edsger W. Dijkstra
        </blockquote>

        <p>
          Each essay is crafted with the care of a printer setting movable type, focusing on clarity, depth, and practical wisdom tested in high-throughput production environments.
        </p>
      </div>

      {/* Contact section */}
      <div id="contact" className="pt-8 border-t border-neutral-200 space-y-4">
        <h3 className="font-serif text-xl font-bold text-neutral-900">Correspondence</h3>
        <p className="text-xs text-neutral-600 font-serif leading-relaxed">
          Questions, editorial letters, or ideas for collaboration are always welcomed. You may reach our writing desk at:
        </p>
        <div className="flex items-center space-x-2 text-xs font-sans font-semibold text-neutral-900">
          <Mail className="w-4 h-4 text-neutral-500" />
          <span>editor@golangchronicle.org</span>
        </div>
      </div>
    </div>
  );
}
