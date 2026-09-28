"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryCount, Post } from "@/types";
import { api } from "@/lib/api";
import PostCard from "@/components/PostCard";
import { Layers, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

function CategoriesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("selected") || "All";

  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== "All") params.category = selectedCategory;

      const res = await api.get("/posts", { params });
      setPosts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-neutral-300 pb-4 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-black font-serif"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
          Topics & Categories
        </h1>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase font-sans">
          Browse essays catalogued by theological, architectural, and craft themes
        </p>
      </div>

      {/* Category selector pill strip */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-neutral-200 pb-6">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-3.5 py-1.5 text-xs font-serif transition-all border ${
            selectedCategory === "All"
              ? "bg-neutral-900 text-white border-neutral-900 font-bold"
              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900"
          }`}
        >
          All Topics ({categories.reduce((acc, c) => acc + c.count, 0)})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(cat.category)}
            className={`px-3.5 py-1.5 text-xs font-serif transition-all border flex items-center space-x-1.5 ${
              selectedCategory === cat.category
                ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900"
            }`}
          >
            <span>{cat.category}</span>
            <span className="text-[10px] opacity-60 font-sans">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Results Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-serif font-bold text-neutral-900">
          {selectedCategory === "All" ? "All Essays" : `${selectedCategory} Essays`} ({filteredPosts.length})
        </h3>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search within topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 placeholder:italic font-serif"
          />
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-20 bg-neutral-200"></div>
          <div className="h-20 bg-neutral-200"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-10 text-center border border-neutral-200 text-neutral-400 text-xs italic font-serif">
          No essays found matching this category.
        </div>
      ) : (
        <div className="divide-y divide-neutral-200">
          {filteredPosts.map((post) => (
            <PostCard key={post.ID} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs font-serif text-neutral-400">Loading catalog...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
