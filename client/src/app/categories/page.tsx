"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryCount, Post } from "@/types";
import { api } from "@/lib/api";
import PostCard from "@/components/PostCard";
import { Layers, Sparkles, BookOpen, Code2, Server, Database, Globe, Wrench, Search } from "lucide-react";

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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "go":
      case "golang":
        return <Code2 className="w-5 h-5 text-cyan-600" />;
      case "backend":
        return <Server className="w-5 h-5 text-blue-600" />;
      case "database":
      case "postgresql":
        return <Database className="w-5 h-5 text-emerald-600" />;
      case "frontend":
        return <Globe className="w-5 h-5 text-purple-600" />;
      case "devops":
        return <Wrench className="w-5 h-5 text-amber-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-violet-900 text-white p-8 sm:p-12 rounded-3xl overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs text-indigo-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Taxonomy & Topics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore by Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Browse our catalog organized by programming languages, backend architecture, databases, and engineering practices.
          </p>
        </div>
      </div>

      {/* Category Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            selectedCategory === "All"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
              : "bg-white text-gray-900 border-gray-100 hover:border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${selectedCategory === "All" ? "bg-white/10" : "bg-indigo-50"}`}>
              <Sparkles className={`w-5 h-5 ${selectedCategory === "All" ? "text-white" : "text-indigo-600"}`} />
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                selectedCategory === "All" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {categories.reduce((acc, c) => acc + c.count, 0)}
            </span>
          </div>
          <h4 className="font-bold text-sm">All Topics</h4>
          <p className={`text-[11px] mt-1 ${selectedCategory === "All" ? "text-indigo-100" : "text-gray-400"}`}>
            Complete archive
          </p>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(cat.category)}
            className={`p-5 rounded-2xl border text-left transition-all ${
              selectedCategory === cat.category
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                : "bg-white text-gray-900 border-gray-100 hover:border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${selectedCategory === cat.category ? "bg-white/10" : "bg-slate-50"}`}>
                {getCategoryIcon(cat.category)}
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.category ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {cat.count}
              </span>
            </div>
            <h4 className="font-bold text-sm">{cat.category}</h4>
            <p className={`text-[11px] mt-1 ${selectedCategory === cat.category ? "text-indigo-100" : "text-gray-400"}`}>
              {cat.count} {cat.count === 1 ? "article" : "articles"}
            </p>
          </button>
        ))}
      </div>

      {/* Filtered Posts List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {selectedCategory === "All" ? "All Articles" : `${selectedCategory} Articles`}
            </h3>
            <p className="text-xs text-gray-400">
              Showing {filteredPosts.length} results
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Filter these articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 h-48 animate-pulse"></div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400 text-sm">
            No articles found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.ID} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs text-gray-400">Loading categories...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
