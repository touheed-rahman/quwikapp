
import { supabase } from "@/integrations/supabase/client";
import { FeatureOrder } from "../types";

export function useOrderManagement() {
  const createFeatureOrder = async (orderData: Omit<FeatureOrder, "id" | "created_at" | "updated_at" | "invoice_url">) => {
    try {
      // Check if user has free features available
      const { data: hasFreeFeatures, error: freeFeatureError } = await supabase.rpc(
        'has_free_features_available' as any,
        { user_id: orderData.seller_id }
      );

      if (freeFeatureError) {
        console.error('Failed to check free features availability:', freeFeatureError);
        throw new Error('Failed to check free features: ' + freeFeatureError.message);
      }

      // If price is 0 but user has no free features left, throw error
      if (orderData.amount === 0 && !hasFreeFeatures) {
        throw new Error('You have used all your free feature requests. Please purchase a feature plan.');
      }

      // Use type assertion to let TypeScript know this is a valid RPC call
      const { data, error } = await supabase.rpc(
        'create_feature_order' as any,
        { order_data: orderData }
      );

      if (error) {
        console.error('Failed to create order:', error);
        throw new Error('Failed to create order: ' + error.message);
      }

      return data as FeatureOrder;
    } catch (error: any) {
      console.error("Order creation error:", error);
      throw error;
    }
  };

  const updateOrderInvoiceUrl = async (orderId: string, invoiceUrl: string) => {
    try {
      // Use type assertion to let TypeScript know this is a valid RPC call
      const { data, error } = await supabase.rpc(
        'update_feature_order_invoice' as any,
        { 
          order_id: orderId,
          invoice_url: invoiceUrl 
        }
      );
      
      if (error) {
        console.error('Failed to update invoice URL:', error);
        throw error;
      }
      
      return data as FeatureOrder;
    } catch (error) {
      console.error("Update invoice URL error:", error);
      throw error;
    }
  };

  const updateListingFeatureStatus = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ featured_requested: true })
        .eq('id', listingId);

      if (error) {
        throw new Error('Failed to update listing feature status');
      }
      
      return true;
    } catch (error) {
      console.error("Update listing status error:", error);
      throw error;
    }
  };

  const getFeatureRequestCount = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc(
        'get_feature_request_count' as any,
        { user_id: userId }
      );
      
      if (error) {
        console.error('Failed to get feature request count:', error);
        throw error;
      }
      
      return data as number;
    } catch (error) {
      console.error("Get feature request count error:", error);
      throw error;
    }
  };

  const getFeaturePrice = async (category: string, subcategory: string, featureType: string) => {
    try {
      const { data, error } = await supabase.rpc(
        'get_feature_price' as any,
        { 
          category_name: category,
          subcategory_name: subcategory,
          feature_type_name: featureType
        }
      );
      
      if (error) {
        console.error('Failed to get feature price:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Get feature price error:", error);
      throw error;
    }
  };

  return {
    createFeatureOrder,
    updateOrderInvoiceUrl,
    updateListingFeatureStatus,
    getFeatureRequestCount,
    getFeaturePrice
  };
}
