"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Rss, LogOut, LayoutDashboard, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Categories", href: "/categories" },
    { name: "Archives", href: "/archive" },
    { name: "Contact", href: "/about#contact" },
  ];

  return (
    <header className="bg-[#fdfdfc] border-b border-neutral-200 mb-8">
      {/* Newspaper Masthead */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center">
        <Link href="/" className="inline-block group">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
            The Golang Chronicle
          </h1>
        </Link>
        <p className="mt-2 text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
          Reflections on Software, Golang, Architecture & Systems
        </p>
      </div>

      {/* Main Menu Bar */}
      <div className="border-t border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-medium tracking-wide text-neutral-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`hover:text-black transition-colors relative py-1 ${
                    isActive ? "font-bold text-black underline underline-offset-8 decoration-1" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center space-x-4 text-neutral-600">
            {token ? (
              <div className="flex items-center space-x-3 text-xs">
                <Link
                  href="/admin"
                  className="flex items-center space-x-1.5 font-semibold text-neutral-900 hover:text-indigo-600 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Studio</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="hover:text-rose-600 transition-colors p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>

            <Link href="/archive" title="Search Articles" className="hover:text-black transition-colors p-1">
              <Search className="w-4 h-4" />
            </Link>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("RSS Feed subscribed!"); }}
              title="RSS Feed"
              className="hover:text-black transition-colors p-1"
            >
              <Rss className="w-4 h-4" />
            </a>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 text-neutral-700 hover:text-black"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-neutral-800 hover:text-black py-1"
            >
              {link.name}
            </Link>
          ))}
          {token && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-indigo-700 py-1"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
