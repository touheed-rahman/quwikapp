
import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'] & {
  seller: Profile | null;
  featured: boolean;
};
export type Follow = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};

// Add TypeScript declarations for our database functions
declare global {
  interface SupabaseDatabase {
    check_if_following: (args: { follower_uid: string; following_uid: string }) => boolean;
    follow_user: (args: { following_uid: string }) => void;
    unfollow_user: (args: { following_uid: string }) => void;
  }
}
