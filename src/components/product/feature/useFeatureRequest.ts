
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";
import { UserDetails, FeatureOption } from "./types";
import { useLocation } from "@/contexts/LocationContext";

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
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    phone: "",
    address: "",
    location: selectedLocation
  });
  const { toast } = useToast();

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = async (location: string | null) => {
    if (setSelectedLocation) {
      await setSelectedLocation(location);
      setUserDetails(prev => ({
        ...prev,
        location
      }));
    }
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

      // Use direct fetch with the REST API for the RPC call
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgrtrdwvkkhraizqukwt.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncnRyZHd2a2tocmFpenF1a3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjE2NTIsImV4cCI6MjA1MzYzNzY1Mn0.mnC-NB_broDr4nOHggi0ngeDC1CxZsda6X-wyEMD2tE';
      
      // Call the RPC function using REST API
      const rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/request_feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          listing_id: productId,
          feature_type: selectedOption
        })
      });

      if (!rpcResponse.ok) {
        const errorData = await rpcResponse.json();
        throw new Error(`Failed to submit feature request: ${errorData.message || rpcResponse.statusText}`);
      }

      // Generate a free invoice record
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
        contact_address: userDetails.address,
        contact_location: userDetails.location
      };
      
      // Create order using REST API
      const createOrderResponse = await fetch(`${supabaseUrl}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        throw new Error('Failed to create order: ' + (errorData.message || createOrderResponse.statusText));
      }

      const orderResult = await createOrderResponse.json();
      
      const selectedFeatureOption = featureOptions.find(o => o.id === selectedOption) as FeatureOption;
      
      // Generate and upload invoice
      const invoiceUrl = await generateInvoice({
        ...orderData,
        id: orderResult[0]?.id
      }, selectedFeatureOption);
      
      if (invoiceUrl) {
        // Update order with invoice URL using REST API
        await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderResult[0]?.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ invoice_url: invoiceUrl })
        });
        
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
        setUserDetails({ name: "", phone: "", address: "", location: selectedLocation });
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
    handleLocationChange,
    handleNext,
    handleDetailsNext,
    handleDownloadInvoice
  };
}
