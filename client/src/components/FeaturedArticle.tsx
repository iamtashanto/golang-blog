import Link from "next/link";
import { Post } from "@/types";

interface FeaturedArticleProps {
  post: Post;
}

export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  const words = (post.content || "").trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const formattedDate = new Date(post.CreatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="pb-10 border-b border-neutral-300 space-y-4">
      {/* Category & Date Superheader */}
      <div className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase font-sans">
        FEATURED ARTICLE • {formattedDate} • {post.category || "GENERAL"}
      </div>

      {/* Main Title */}
      <Link href={`/posts/${post.ID}`} className="block group">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-neutral-900 group-hover:text-neutral-700 leading-tight transition-colors">
          {post.title}
        </h2>
      </Link>

      {/* Byline */}
      <div className="text-xs italic text-neutral-500 font-serif">
        By Editorial Author • {readingTime} min read
      </div>

      {/* Content layout: Left Image, Right Text */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2 items-start">
        <div className="sm:col-span-5 h-48 sm:h-52 w-full bg-neutral-100 overflow-hidden border border-neutral-300 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              post.image_url ||
              "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
            }
            alt={post.title}
            className="w-full h-full object-cover grayscale contrast-110 hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="sm:col-span-7 space-y-3">
          <p className="text-xs sm:text-sm text-neutral-700 font-serif leading-relaxed line-clamp-6 sm:line-clamp-7">
            {post.summary || post.content}
          </p>
          <div className="pt-2">
            <Link
              href={`/posts/${post.ID}`}
              className="text-xs font-bold text-neutral-900 hover:underline font-serif inline-flex items-center space-x-1"
            >
              <span>Read More →</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
