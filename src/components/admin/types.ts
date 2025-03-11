
import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'] & {
  seller: Profile | null;
  featured: boolean;
};

// Feature related types
export interface FeaturePricing {
  id?: string;
  category: string;
  subcategory: string | null;
  feature_type: string;
  price: number;
  original_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface FeatureCoupon {
  id?: string;
  code: string;
  discount_percent: number;
  discount_amount?: number | null;
  min_order_amount?: number | null;
  max_discount?: number | null;
  valid_from: string;
  valid_until: string;
  usage_limit?: number | null;
  usage_count: number;
  created_at?: string;
  updated_at?: string;
}
