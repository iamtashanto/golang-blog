import Link from "next/link";
import { Post } from "@/types";
import { MessageSquare, Eye, ThumbsUp } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const words = (post.content || "").trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const formattedDate = new Date(post.CreatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="py-7 border-b border-neutral-200/80 last:border-b-0 space-y-2">
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-6 items-start">
        {/* Left text column */}
        <div className="space-y-2 flex-1">
          {/* Superheader */}
          <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-neutral-500 uppercase font-sans">
            {post.category || "GENERAL"} • {formattedDate} • {readingTime} min read
          </div>

          {/* Title */}
          <Link href={`/posts/${post.ID}`} className="block group">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug transition-colors">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-neutral-600 font-serif leading-relaxed line-clamp-3">
            {post.summary || post.content}
          </p>

          {/* Footer Metadata */}
          <div className="pt-2 flex items-center space-x-4 text-xs font-serif text-neutral-600">
            <Link
              href={`/posts/${post.ID}`}
              className="font-bold text-neutral-900 hover:underline inline-flex items-center"
            >
              Read More →
            </Link>

            <span className="text-neutral-300">•</span>

            <span className="flex items-center space-x-1 text-neutral-500 text-xs">
              <MessageSquare className="w-3 h-3 text-neutral-400" />
              <span>{post.comments?.length || 0} Comments</span>
            </span>

            <span className="text-neutral-300 hidden sm:inline">•</span>

            <span className="hidden sm:inline-flex items-center space-x-1 text-neutral-400 text-xs font-sans">
              <Eye className="w-3 h-3" />
              <span>{post.views || 0}</span>
            </span>

            <span className="text-neutral-300 hidden sm:inline">•</span>

            <span className="hidden sm:inline-flex items-center space-x-1 text-neutral-400 text-xs font-sans">
              <ThumbsUp className="w-3 h-3" />
              <span>{post.likes || 0}</span>
            </span>
          </div>
        </div>

        {/* Right image thumbnail */}
        {post.image_url ? (
          <div className="w-full sm:w-36 h-36 sm:h-28 shrink-0 bg-neutral-100 border border-neutral-300 overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover grayscale contrast-110 hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-full sm:w-36 h-28 shrink-0 bg-[#f7f6f2] border border-neutral-200/90 flex items-center justify-center p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-sans">
              {post.category || "Essay"}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
