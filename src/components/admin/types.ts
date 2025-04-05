
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

// Additional service provider types
export interface ServiceProvider extends Profile {
  business_name?: string;
  provider_type?: string;
  services?: string;
  provider_status?: "pending" | "approved" | "rejected";
  rating?: number;
  total_services?: number;
}

// Extend service lead type
export interface ServiceLead {
  id: string;
  customer_name?: string;
  phone?: string;
  service_category?: string;
  service_type?: string;
  description?: string;
  address?: string;
  appointment_date?: string;
  appointment_time?: string;
  status?: string;
  urgent?: boolean;
  created_at?: string;
  updated_at?: string;
  provider_id?: string; // ID of the assigned service provider
  amount?: number;
}
