
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FeatureOption, UserDetails } from "./types";
import { useInvoiceGeneration } from "./hooks/useInvoiceGeneration";
import { useOrderManagement } from "./hooks/useOrderManagement";
import { supabase } from "@/integrations/supabase/client";

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
  const { generateInvoice } = useInvoiceGeneration();
  const { createFeatureOrder, updateOrderInvoiceUrl, updateListingFeatureStatus } = useOrderManagement();

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitFeatureRequest = async (featureOptions: FeatureOption[]) => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      await updateListingFeatureStatus(productId);

      const invoiceNumber = `INV-${Date.now().toString().substring(7)}`;
      const selectedFeatureOption = featureOptions.find(o => o.id === selectedOption) as FeatureOption;
      
      const orderData = {
        listing_id: productId,
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

      const orderResult = await createFeatureOrder(orderData);
      
      if (orderResult) {
        const invoiceUrl = await generateInvoice(
          { ...orderData, id: orderResult.id },
          selectedFeatureOption,
          userDetails
        );
        
        if (invoiceUrl) {
          await updateOrderInvoiceUrl(orderResult.id, invoiceUrl);
          setInvoiceUrl(invoiceUrl);
        }
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
    if (!userDetails.name || !userDetails.phone || !userDetails.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
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
