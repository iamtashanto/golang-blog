"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Post {
  ID: number;
  title: string;
  content: string;
  created_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/posts')
      .then((res) => {
        setPosts(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Loading posts...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold border-b pb-4">Latest Posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <article key={post.ID} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{new Date(post.created_at).toLocaleDateString()}</p>
            <div className="text-gray-700 whitespace-pre-wrap">{post.content}</div>
          </article>
        ))
      )}
    </div>
  );
}
