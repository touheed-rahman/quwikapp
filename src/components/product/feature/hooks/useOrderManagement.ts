
import { supabase } from "@/integrations/supabase/client";
import { FeatureOrder } from "../types";

export function useOrderManagement() {
  const createFeatureOrder = async (orderData: Omit<FeatureOrder, "id" | "created_at" | "updated_at" | "invoice_url">) => {
    try {
      const { data, error } = await supabase.rpc(
        'create_feature_order',
        { order_data: orderData }
      );

      if (error) {
        throw new Error('Failed to create order: ' + error.message);
      }

      return data;
    } catch (error: any) {
      console.error("Order creation error:", error);
      throw error;
    }
  };

  const updateOrderInvoiceUrl = async (orderId: string, invoiceUrl: string) => {
    try {
      const { error } = await supabase.rpc(
        'update_feature_order_invoice',
        { 
          order_id: orderId,
          invoice_url: invoiceUrl 
        }
      );
      
      if (error) {
        console.error('Failed to update invoice URL:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Update invoice URL error:", error);
      return false;
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
