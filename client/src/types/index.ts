export interface Post {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  category: string;
  image_url?: string;
  views: number;
  likes: number;
  author_id?: number;
  published: boolean;
  comments?: Comment[];
}

export interface Comment {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  post_id: number;
  author: string;
  email?: string;
  content: string;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface BlogStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
