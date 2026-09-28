"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post, CategoryCount } from "@/types";
import { api } from "@/lib/api";
import FeaturedArticle from "@/components/FeaturedArticle";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";

// Reference sample posts for fallback if database is fresh
const fallbackPosts: Post[] = [
  {
    ID: 1,
    CreatedAt: "2026-07-29T08:00:00Z",
    UpdatedAt: "2026-07-29T08:00:00Z",
    title: "God is good... ALL the time!",
    category: "Faith",
    summary:
      "We often utter these familiar words in times of serene abundance, yet their true weight and enduring beauty only dawn upon our weary hearts when tested against sudden grief and seasons of unexpected testing. Sitting on the front porch this quiet dawn, watching the mist lift off the pasture, I was reminded once more of providence unbidden.",
    content:
      "We often utter these familiar words in times of serene abundance, yet their true weight and enduring beauty only dawn upon our weary hearts when tested against sudden grief and seasons of unexpected testing. Sitting on the front porch this quiet dawn, watching the mist lift off the pasture, I was reminded once more of providence unbidden.\n\nThere is a peculiar quiet that settles over the valley before the sun breaks the treeline. In that stillness, one remembers that faithfulness is not measured by the absence of storm, but by the quiet anchor that holds through the night.",
    image_url:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    views: 142,
    likes: 38,
    published: true,
    comments: [],
  },
  {
    ID: 2,
    CreatedAt: "2026-07-24T12:00:00Z",
    UpdatedAt: "2026-07-24T12:00:00Z",
    title: "Sundays at the Round Oak Table",
    category: "Family",
    summary:
      "Passing the heavy porcelain roast dish from hand to hand while three generations converse at once. There is an unspoken liturgy to an old family table that modern convenience can never reproduce.",
    content:
      "Passing the heavy porcelain roast dish from hand to hand while three generations converse at once. There is an unspoken liturgy to an old family table that modern convenience can never reproduce.\n\nThe oak was seasoned when my great-grandfather bought it in town. It bears the knife marks of boys who became soldiers and the cup rings of mothers who spent fifty years pouring coffee for neighbors in grief and joy.",
    image_url:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=80",
    views: 98,
    likes: 24,
    published: true,
    comments: [
      { ID: 1, CreatedAt: "2026-07-25T10:00:00Z", UpdatedAt: "2026-07-25T10:00:00Z", post_id: 2, author: "Sarah Jenkins", content: "This brought tears to my eyes." },
      { ID: 2, CreatedAt: "2026-07-25T14:00:00Z", UpdatedAt: "2026-07-25T14:00:00Z", post_id: 2, author: "David Miller", content: "Wonderful piece." },
      { ID: 3, CreatedAt: "2026-07-26T09:00:00Z", UpdatedAt: "2026-07-26T09:00:00Z", post_id: 2, author: "Mary Claire", content: "Reminds me of our Sundays growing up." },
      { ID: 4, CreatedAt: "2026-07-26T11:00:00Z", UpdatedAt: "2026-07-26T11:00:00Z", post_id: 2, author: "Pastor Thomas", content: "Amen." },
      { ID: 5, CreatedAt: "2026-07-27T08:00:00Z", UpdatedAt: "2026-07-27T08:00:00Z", post_id: 2, author: "Evelyn Reed", content: "Beautifully written." },
      { ID: 6, CreatedAt: "2026-07-27T16:00:00Z", UpdatedAt: "2026-07-27T16:00:00Z", post_id: 2, author: "Arthur Pendelton", content: "The table remains." },
    ],
  },
  {
    ID: 3,
    CreatedAt: "2026-07-18T15:00:00Z",
    UpdatedAt: "2026-07-18T15:00:00Z",
    title: "What the Town Clerk's Ledger of 1884 Forgot to Mention",
    category: "History",
    summary:
      "Between the property tax disputes and cattle brand registrations sits a tiny penciled margin note recording the sudden freeze that killed the peach blossoms in April.",
    content:
      "Between the property tax disputes and cattle brand registrations sits a tiny penciled margin note recording the sudden freeze that killed the peach blossoms in April.\n\nOfficial records preserve what councils vote upon; margins preserve what broke men's hearts.",
    image_url:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80",
    views: 115,
    likes: 31,
    published: true,
    comments: Array(11).fill({ ID: 1, CreatedAt: "2026-07-19T10:00:00Z", UpdatedAt: "2026-07-19T10:00:00Z", post_id: 3, author: "Historian", content: "Fascinating archive note." }),
  },
  {
    ID: 4,
    CreatedAt: "2026-07-11T16:00:00Z",
    UpdatedAt: "2026-07-11T16:00:00Z",
    title: "The Quiet Dignity of Slow Machinery",
    category: "Commentary",
    summary:
      "Why our obsession with frictionless velocity is robbing small towns of craft, conversation, and the patience required to fix what is broken rather than discard it.",
    content:
      "Why our obsession with frictionless velocity is robbing small towns of craft, conversation, and the patience required to fix what is broken rather than discard it.\n\nA machine with exposed gears demands respect and attention. You must grease it; you must listen to its cadence.",
    image_url:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
    views: 87,
    likes: 29,
    published: true,
    comments: Array(8).fill({ ID: 1, CreatedAt: "2026-07-12T10:00:00Z", UpdatedAt: "2026-07-12T10:00:00Z", post_id: 4, author: "Craftsman", content: "Deeply resonated." }),
  },
  {
    ID: 5,
    CreatedAt: "2026-07-04T18:00:00Z",
    UpdatedAt: "2026-07-04T18:00:00Z",
    title: "Porch Lanterns and Fireflies: Small Town Independence Day",
    category: "Culture",
    summary:
      "Before the synchronized drone spectacles, there was the single brass trumpet playing taps from the bandstand while children caught lightning bugs in mason jars.",
    content:
      "Before the synchronized drone spectacles, there was the single brass trumpet playing taps from the bandstand while children caught lightning bugs in mason jars.\n\nThe air smelled of damp cut grass and spent paper firecrackers.",
    image_url:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=80",
    views: 204,
    likes: 54,
    published: true,
    comments: Array(19).fill({ ID: 1, CreatedAt: "2026-07-05T10:00:00Z", UpdatedAt: "2026-07-05T10:00:00Z", post_id: 5, author: "Reader", content: "Treasured memories." }),
  },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsRes, catRes] = await Promise.all([
        api.get("/posts?sort=latest"),
        api.get("/categories"),
      ]);

      const fetched = postsRes.data.data;
      if (fetched && fetched.length > 0) {
        setPosts(fetched);
      } else {
        // Fallback to sample reference posts if DB has no articles yet
        setPosts(fallbackPosts);
      }
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error(err);
      setPosts(fallbackPosts);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  const featuredPost = !searchQuery.trim() && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const listPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      {/* LEFT COLUMN: ARTICLES FEED (8 COLS) */}
      <div className="lg:col-span-8 space-y-8">
        {/* 1. TOP FEATURED ARTICLE */}
        {featuredPost && <FeaturedArticle post={featuredPost} />}

        {/* 2. LATEST POSTS HEADER */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-neutral-300 pb-2">
            <h2 className="text-2xl font-serif font-bold text-[#162f4d] tracking-tight">
              {searchQuery ? `Search Results (${filteredPosts.length})` : "Latest Posts"}
            </h2>
            <Link
              href="/archive"
              className="text-[11px] font-bold tracking-[0.18em] text-[#64748b] hover:text-[#162f4d] uppercase font-sans transition-colors"
            >
              Chronological Archive
            </Link>
          </div>

          {/* 3. LIST OF POSTS */}
          <div className="divide-y divide-neutral-200">
            {listPosts.map((post) => (
              <PostCard key={post.ID} post={post} />
            ))}
          </div>

          {/* 4. PAGINATION FOOTER */}
          <div className="pt-8 border-t border-neutral-200 flex items-center justify-between text-xs font-serif text-[#334155]">
            <button
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              className="hover:underline flex items-center space-x-1"
            >
              <span>← Older Entries</span>
            </button>

            <div className="flex items-center space-x-3 font-serif text-xs">
              <button
                onClick={() => setActivePage(1)}
                className={`px-1.5 py-0.5 ${activePage === 1 ? "border-b border-black font-bold text-black" : "hover:underline text-[#64748b]"}`}
              >
                1
              </button>
              <button
                onClick={() => setActivePage(2)}
                className={`px-1.5 py-0.5 ${activePage === 2 ? "border-b border-black font-bold text-black" : "hover:underline text-[#64748b]"}`}
              >
                2
              </button>
              <button
                onClick={() => setActivePage(3)}
                className={`px-1.5 py-0.5 ${activePage === 3 ? "border-b border-black font-bold text-black" : "hover:underline text-[#64748b]"}`}
              >
                3
              </button>
              <span className="text-[#94a3b8]">…</span>
              <button
                onClick={() => setActivePage(18)}
                className="px-1.5 py-0.5 hover:underline text-[#64748b]"
              >
                18
              </button>
            </div>

            <button
              onClick={() => setActivePage((p) => Math.min(18, p + 1))}
              className="hover:underline flex items-center space-x-1"
            >
              <span>Newer Entries →</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SIDEBAR (4 COLS) */}
      <div className="lg:col-span-4">
        <Sidebar
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </div>
  );
}
