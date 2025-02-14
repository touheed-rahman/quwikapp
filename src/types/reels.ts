
export interface Reel {
  id: string;
  video_url: string;
  description?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface ReelComment {
  id: string;
  reel_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user: {
    name: string;
    avatar_url?: string;
  };
}
