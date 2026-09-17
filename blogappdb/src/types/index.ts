export interface Category {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}