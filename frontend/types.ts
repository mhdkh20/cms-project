// Resource Interfaces

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Article {
  id: number;
  title: string;
  slug?: string;
  content: string;
  image?: string | null;
  is_published: boolean;
  category_id?: number;
    status: 'published' | 'draft';

  categories?: Category[];
  author?: string; // or User object depending on API
  created_at: string;
}

export interface Comment {
  id: number;
  article_id: number;
  name: string;
  email: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_reviewed: boolean;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

// API Response Wrappers
export interface PaginatedResponse<T> {
  data: T[];
  links?: any;
  meta?: any;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
}
