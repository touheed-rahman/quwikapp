
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePDF } from "@/utils/pdfUtils";
import { FeatureOption, FeatureOrder, UserDetails } from "../types";

export function useInvoiceGeneration() {
  const generateInvoice = async (
    order: FeatureOrder, 
    selectedFeatureOption: FeatureOption,
    userDetails: UserDetails
  ) => {
    try {
      const invoiceData = {
        invoiceNumber: order.invoice_number,
        date: new Date().toLocaleDateString(),
        customerName: userDetails.name,
        customerAddress: userDetails.address,
        customerPhone: userDetails.phone,
        items: [
          {
            description: `Feature Plan: ${order.feature_type} for listing "${order.invoice_number}"`,
            amount: 0,
            originalPrice: selectedFeatureOption.originalPrice
          }
        ],
        total: 0,
        companyName: "Quwik",
        companyAddress: "Bangalore, India",
        discount: selectedFeatureOption.originalPrice
      };

      const pdfBlob = await generateInvoicePDF(invoiceData);
      
      const fileName = `invoice_${order.invoice_number}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(`public/${fileName}`, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) {
        console.error("Error uploading invoice:", uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('invoices')
        .getPublicUrl(`public/${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error("Error generating invoice:", error);
      return null;
    }
  };

  return { generateInvoice };
}
