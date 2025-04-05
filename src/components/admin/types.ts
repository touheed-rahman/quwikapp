
import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'] & {
  seller: Profile | null;
  featured: boolean;
};

// Custom interfaces for feature management
export interface FeaturePricing {
  id?: string;
  category: string;
  subcategory: string;
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
  valid_from: string;
  valid_to: string;
  max_uses: number;
  current_uses: number;
  created_at?: string;
  updated_at?: string;
}

// Interface for service lead management
export interface ServiceLead {
  id: string;
  customer_name: string;
  phone: string;
  service_type: string;
  service_category: string;
  address: string;
  description?: string;
  status: string;
  appointment_date: string;
  appointment_time: string;
  urgent: boolean;
  amount?: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
  provider_id?: string;
}
