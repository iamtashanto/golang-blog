import Link from "next/link";
import { Post } from "@/types";
import { MessageSquare } from "lucide-react";

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
    <article className="py-6 border-b border-neutral-200 last:border-b-0 space-y-1.5 font-serif">
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-6 items-start">
        {/* Left text column */}
        <div className="space-y-1.5 flex-1">
          {/* Category • Date • Read time */}
          <div className="text-[11px] font-bold tracking-[0.15em] text-[#64748b] uppercase font-sans">
            {post.category || "FAMILY"} • {formattedDate} • {readingTime} min read
          </div>

          {/* Title */}
          <Link href={`/posts/${post.ID}`} className="block group">
            <h3 className="text-xl sm:text-[22px] font-serif font-bold text-[#162f4d] group-hover:underline leading-snug transition-colors">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs sm:text-[13px] text-[#334155] font-serif leading-relaxed line-clamp-2 sm:line-clamp-3">
            {post.summary || post.content}
          </p>

          {/* Footer Metadata */}
          <div className="pt-1.5 flex items-center space-x-3 text-xs font-serif text-[#162f4d]">
            <Link
              href={`/posts/${post.ID}`}
              className="font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>Read More →</span>
            </Link>

            <span className="text-neutral-300"></span>

            <span className="flex items-center space-x-1 text-[#64748b] text-xs font-serif">
              <MessageSquare className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>{post.comments?.length || 0} Comments</span>
            </span>
          </div>
        </div>

        {/* Right image thumbnail */}
        <div className="w-full sm:w-36 h-36 sm:h-28 shrink-0 bg-neutral-100 border border-[#cbd5e1] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              post.image_url ||
              "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&auto=format&fit=crop&q=80"
            }
            alt={post.title}
            className="w-full h-full object-cover grayscale contrast-110"
          />
        </div>
      </div>
    </article>
  );
}
