
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
