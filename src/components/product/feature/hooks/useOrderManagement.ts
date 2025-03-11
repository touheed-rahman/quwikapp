
import { supabase } from "@/integrations/supabase/client";
import { FeatureOrder } from "../types";

export function useOrderManagement() {
  const createFeatureOrder = async (orderData: Omit<FeatureOrder, "id" | "created_at" | "updated_at" | "invoice_url">) => {
    try {
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

  return {
    createFeatureOrder,
    updateOrderInvoiceUrl,
    updateListingFeatureStatus
  };
}
