
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";
import { UserDetails, FeatureOption } from "./types";

export function useFeatureRequest(
  productId: string,
  productTitle: string,
  onFeatureSuccess: () => void,
  onClose: () => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    phone: "",
    address: ""
  });
  const { toast } = useToast();

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateInvoice = async (order: any, selectedFeatureOption: FeatureOption) => {
    try {
      // Generate invoice PDF
      const invoiceData = {
        invoiceNumber: order.invoice_number,
        date: new Date().toLocaleDateString(),
        customerName: userDetails.name,
        customerAddress: userDetails.address,
        customerPhone: userDetails.phone,
        items: [
          {
            description: `Feature Plan: ${selectedOption} for listing "${productTitle}"`,
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
      
      // Upload to Supabase storage
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

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('invoices')
        .getPublicUrl(`public/${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error("Error generating invoice:", error);
      return null;
    }
  };

  const handleSubmitFeatureRequest = async (featureOptions: FeatureOption[]) => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // First, update the product's featured_requested status
      const { error: updateError } = await supabase
        .from('products')
        .update({ featured_requested: true })
        .eq('id', productId);

      if (updateError) {
        throw new Error('Failed to update product feature status');
      }

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now().toString().substring(7)}`;
      
      // Create order data
      const orderData = {
        product_id: productId,
        buyer_id: session.user.id,
        seller_id: session.user.id,
        amount: 0,
        payment_status: "completed",
        invoice_number: invoiceNumber,
        order_type: "feature",
        feature_type: selectedOption,
        contact_name: userDetails.name,
        contact_phone: userDetails.phone,
        contact_address: userDetails.address
      };
      
      // Create order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (orderError) {
        throw new Error('Failed to create order: ' + orderError.message);
      }

      const selectedFeatureOption = featureOptions.find(o => o.id === selectedOption) as FeatureOption;
      
      // Generate and upload invoice
      const invoiceUrl = await generateInvoice(orderData, selectedFeatureOption);
      
      if (invoiceUrl) {
        // Update order with invoice URL
        await supabase
          .from('orders')
          .update({ invoice_url: invoiceUrl })
          .eq('id', orderResult[0].id);
        
        setInvoiceUrl(invoiceUrl);
      }

      setPaymentComplete(true);
      toast({
        title: "Feature Request Submitted!",
        description: "Your listing has been submitted for featuring. An admin will review and approve it soon.",
        variant: "default",
      });
      
      setTimeout(() => {
        onFeatureSuccess();
        onClose();
        setStep(1);
        setSelectedOption(null);
        setPaymentComplete(false);
        setUserDetails({ name: "", phone: "", address: "" });
        setInvoiceUrl(null);
      }, 5000);
      
    } catch (error: any) {
      console.error("Feature request error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!selectedOption) {
      toast({
        title: "Please select an option",
        description: "You must select a feature option to continue",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleDetailsNext = (featureOptions: FeatureOption[]) => {
    // Validate details
    if (!userDetails.name || !userDetails.phone || !userDetails.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Submit feature request
    handleSubmitFeatureRequest(featureOptions);
  };

  const handleDownloadInvoice = () => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    }
  };

  return {
    isSubmitting,
    selectedOption,
    setSelectedOption,
    step,
    setStep,
    paymentComplete,
    invoiceUrl,
    userDetails,
    handleUserDetailsChange,
    handleNext,
    handleDetailsNext,
    handleDownloadInvoice
  };
}
