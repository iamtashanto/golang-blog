import Link from "next/link";
import { Post } from "@/types";

interface FeaturedArticleProps {
  post?: Post | null;
}

export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  // If post from database exists, use its data, otherwise provide the exact default from reference
  const title = post ? post.title : "God is good... ALL the time!";
  const category = post?.category ? post.category.toUpperCase() : "FAITH";
  const date = post
    ? new Date(post.CreatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase()
    : "JULY 29, 2026";
  const words = (post?.content || "").trim().split(/\s+/).length;
  const readingTime = post ? Math.max(1, Math.ceil(words / 200)) : 5;
  const content = post?.summary || post?.content || "We often utter these familiar words in times of serene abundance, yet their true weight and enduring beauty only dawn upon our weary hearts when tested against sudden grief and seasons of unexpected testing. Sitting on the front porch this quiet dawn, watching the mist lift off the pasture, I was reminded once more of providence unbidden.";
  const linkHref = post ? `/posts/${post.ID}` : "#";

  return (
    <article className="pb-8 border-b border-neutral-300 space-y-3 font-serif">
      {/* Superheader */}
      <div className="text-[11px] font-bold tracking-[0.2em] text-[#64748b] uppercase font-sans">
        FEATURED ARTICLE • {date} • {category}
      </div>

      {/* Main Title */}
      <Link href={linkHref} className="block group">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#162f4d] group-hover:text-black leading-tight transition-colors">
          {title}
        </h2>
      </Link>

      {/* Byline */}
      <div className="text-xs text-[#64748b] font-serif">
        By James Castle • {readingTime} min read •
      </div>

      {/* Content layout: Left Image, Right Text */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-1 items-start">
        {/* Left vintage book/quill/inkwell image */}
        <div className="sm:col-span-5 h-48 sm:h-52 w-full bg-neutral-100 border border-[#cbd5e1] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              post?.image_url ||
              "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
            }
            alt={title}
            className="w-full h-full object-cover grayscale contrast-110"
          />
        </div>

        {/* Right Excerpt + Read More */}
        <div className="sm:col-span-7 space-y-3">
          <p className="text-xs sm:text-[13px] text-[#334155] font-serif leading-relaxed">
            {content}
          </p>
          <div>
            <Link
              href={linkHref}
              className="text-xs font-serif font-bold text-[#162f4d] hover:underline inline-flex items-center space-x-1"
            >
              <span>Read More →</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
