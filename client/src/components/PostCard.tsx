import Link from "next/link";
import { Post } from "@/types";
import { Eye, ThumbsUp, MessageSquare, Calendar, Clock, ArrowUpRight } from "lucide-react";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  // Approximate reading time (200 words per minute)
  const words = (post.content || "").trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const formattedDate = new Date(post.CreatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const categoryColors: Record<string, string> = {
    Go: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Backend: "bg-blue-50 text-blue-700 border-blue-200",
    Frontend: "bg-purple-50 text-purple-700 border-purple-200",
    DevOps: "bg-amber-50 text-amber-700 border-amber-200",
    Database: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Tutorial: "bg-rose-50 text-rose-700 border-rose-200",
    General: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const badgeStyle = categoryColors[post.category] || "bg-indigo-50 text-indigo-700 border-indigo-200";

  if (featured) {
    return (
      <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {post.image_url ? (
          <div className="lg:col-span-5 h-64 lg:h-full rounded-xl overflow-hidden bg-gray-100 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="lg:col-span-5 h-64 lg:h-full rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-8 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
            <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
              Featured Article
            </span>
            <div>
              <p className="text-sm text-indigo-100 mb-1">Featured Post</p>
              <h4 className="text-xl font-bold line-clamp-2">{post.title}</h4>
            </div>
          </div>
        )}

        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeStyle}`}>
                {post.category || "General"}
              </span>
              <span className="text-xs text-gray-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingTime} min read</span>
              </span>
            </div>

            <Link href={`/posts/${post.ID}`} className="block group-hover:text-indigo-600 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 leading-tight">
                {post.title}
              </h3>
            </Link>

            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {post.summary || post.content}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center space-x-1 text-gray-500">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>{post.views || 0}</span>
              </span>
              <span className="flex items-center space-x-1 text-gray-500">
                <ThumbsUp className="w-3.5 h-3.5 text-rose-500" />
                <span>{post.likes || 0}</span>
              </span>
              <span className="flex items-center space-x-1 text-gray-500">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>{post.comments?.length || 0}</span>
              </span>
            </div>

            <Link
              href={`/posts/${post.ID}`}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Read Full</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {post.image_url ? (
        <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-40 w-full bg-gradient-to-r from-slate-100 to-indigo-50/50 p-6 flex flex-col justify-between border-b border-gray-50">
          <div className="flex justify-between items-center">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
              {post.category || "General"}
            </span>
          </div>
          <span className="text-xs text-gray-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{readingTime} min read</span>
          </span>
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {post.image_url && (
            <div className="flex items-center space-x-2">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                {post.category || "General"}
              </span>
              <span className="text-xs text-gray-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingTime} min</span>
              </span>
            </div>
          )}

          <Link href={`/posts/${post.ID}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
            {post.summary || post.content}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </span>

          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span>{post.views || 0}</span>
            </span>
            <span className="flex items-center space-x-1 text-gray-500 hover:text-rose-600">
              <ThumbsUp className="w-3.5 h-3.5 text-rose-500" />
              <span>{post.likes || 0}</span>
            </span>
            <span className="flex items-center space-x-1 text-gray-500 hover:text-emerald-600">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>{post.comments?.length || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
