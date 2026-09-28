"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { CategoryCount, SiteSetting } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Search, Rss, ChevronDown, LogOut, LayoutDashboard, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [settings, setSettings] = useState<SiteSetting>({
    site_title: "The Castle Chronicle",
    tagline: "REFLECTIONS ON FAMILY, FAITH, CULTURE & HISTORY",
    author_name: "James Castle",
    author_title: "Essayist, Father & Historian",
    author_bio: "Chronicling ordinary days, historic curiosities, and the enduring truths that anchor our households in an accelerating world.",
    author_image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
  });

  useEffect(() => {
    // Fetch dynamic settings & categories once on mount
    api.get("/settings").then((res) => {
      if (res.data.data) setSettings(res.data.data);
    }).catch(() => {});

    api.get("/categories").then((res) => {
      if (res.data.data) setCategories(res.data.data);
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Categories", href: "/categories", hasDropdown: true },
    { name: "Archives", href: "/archive" },
    { name: "Contact", href: "/about#contact" },
  ];

  const categoryList = categories.length > 0 
    ? categories.map(c => c.category)
    : ["Family", "Faith", "Culture", "History", "Commentary", "Humor"];

  return (
    <header className="border-b border-neutral-200 pb-6 mb-8 font-serif">
      {/* 1. Centered Dynamic Newspaper Masthead */}
      <div className="text-center py-4 sm:py-6">
        <Link href="/" className="inline-block group">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold tracking-tight text-[#162f4d] group-hover:opacity-90 transition-opacity">
            {settings.site_title || "The Castle Chronicle"}
          </h1>
        </Link>
        <p className="mt-2 text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#64748b] uppercase font-sans">
          {settings.tagline || "REFLECTIONS ON FAMILY, FAITH, CULTURE & HISTORY"}
        </p>
      </div>

      {/* 2. Menu Navigation Bar with Top & Bottom Rules */}
      <div className="border-t border-b border-neutral-200 mt-2">
        <div className="flex items-center justify-between h-12 px-1 sm:px-2">
          {/* Left: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs sm:text-[13px] font-medium text-[#334155]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-1 py-3 hover:text-black transition-colors ${
                        isActive ? "font-bold text-black border-b-2 border-black" : ""
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>

                    {/* Dynamic Categories Dropdown Menu */}
                    <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-neutral-200 shadow-md py-1.5 w-44 z-50 text-xs font-serif">
                      {categoryList.map((cat) => (
                        <Link
                          key={cat}
                          href={`/categories?selected=${encodeURIComponent(cat)}`}
                          className="block px-4 py-1.5 text-neutral-700 hover:bg-[#f1f5f9] hover:text-black"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-3 hover:text-black transition-colors ${
                    isActive ? "font-bold text-black border-b-2 border-black" : ""
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, RSS & Admin */}
          <div className="flex items-center space-x-4 text-[#475569]">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 text-xs font-sans">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 font-semibold text-[#162f4d] hover:underline"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Studio</span>
                  </Link>
                ) : (
                  <span className="text-slate-600 text-xs font-medium">
                    {user?.name || "Contributor"}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="hover:text-rose-600 transition p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-[#334155] hover:text-black hidden sm:flex items-center space-x-1 font-sans"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>

            <Link href="/archive" title="Search the Chronicle" className="hover:text-black transition p-1">
              <Search className="w-4 h-4" />
            </Link>

            <a
              href="http://localhost:8080/rss"
              target="_blank"
              rel="noreferrer"
              title="Subscribe via RSS"
              className="hover:text-black transition p-1"
            >
              <Rss className="w-4 h-4" />
            </a>

            {/* Mobile menu trigger */}
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
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 space-y-2 text-sm font-serif">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-neutral-800 hover:text-black"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-xs font-sans font-semibold text-[#162f4d]"
          >
            Admin Studio
          </Link>
        </div>
      )}
    </header>
  );
}
