"use client";

import Link from "next/link";
import { Sparkles, Heart, Globe, Mail, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Golang<span className="text-indigo-600">Blog</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              A high-performance modern publishing platform built on Go (Gin + GORM + PostgreSQL) and Next.js with TailwindCSS.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="https://golang.org" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">Recent Articles</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-indigo-600 transition-colors">All Categories</Link>
              </li>
              <li>
                <Link href="/archive" className="hover:text-indigo-600 transition-colors">Chronological Archive</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Stay Updated</h3>
            <p className="text-xs text-gray-500">Subscribe for the latest Golang insights and web dev tutorials.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} GolangBlog. Crafted with Next.js & Gin GORM.</p>
          <p className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Shanto</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
