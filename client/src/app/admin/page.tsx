"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Post {
  ID: number;
  title: string;
  content: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      router.push('/login');
    } else {
      fetchPosts();
    }
  }, [router]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/posts');
      setPosts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (isEditing && editId) {
        await axios.put(`http://localhost:8080/posts/${editId}`, 
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Post updated successfully!');
      } else {
        await axios.post('http://localhost:8080/posts', 
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Post created successfully!');
      }
      
      setTitle('');
      setContent('');
      setIsEditing(false);
      setEditId(null);
      fetchPosts(); // Refresh list
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to save post');
    }
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setIsEditing(true);
    setEditId(post.ID);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete post');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center border-b pb-4 mt-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-red-500 font-semibold hover:underline">Logout</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
        {message && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              type="text" 
              className="w-full border rounded p-2" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea 
              className="w-full border rounded p-2 h-32" 
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              {isEditing ? 'Update Post' : 'Publish Post'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Manage Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.ID} className="hover:bg-gray-50">
                    <td className="border p-2">{post.title}</td>
                    <td className="border p-2">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="border p-2 space-x-2">
                      <button onClick={() => handleEdit(post)} className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Edit</button>
                      <button onClick={() => handleDelete(post.ID)} className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

