import { Search, Sparkles, TrendingUp } from "lucide-react";

interface HeroProps {
  search: string;
  setSearch: (value: string) => void;
  categories: { category: string; count: number }[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  totalPosts: number;
}

export default function Hero({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  totalPosts,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white p-8 sm:p-12 mb-12 shadow-xl shadow-indigo-950/20">
      {/* Background ambient elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          <span>Next-Gen Engineering & Golang Journal</span>
          <span className="bg-indigo-500/40 text-white font-semibold px-2 py-0.5 rounded-full text-[10px]">
            {totalPosts} Articles
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight">
          Explore Ideas, Code & <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-200 to-pink-300">
            Modern Backend Insights
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
          Deep dives into Golang microservices, PostgreSQL architectures, modern React / Next.js frontend, and cloud performance.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title, keyword, or tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all text-sm shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md text-gray-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === "All"
                ? "bg-white text-gray-900 font-semibold shadow-md"
                : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10"
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                selectedCategory === cat.category
                  ? "bg-white text-gray-900 font-semibold shadow-md"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10"
              }`}
            >
              <span>{cat.category}</span>
              <span className="text-[10px] opacity-70 bg-black/20 px-1.5 py-0.5 rounded-full">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
