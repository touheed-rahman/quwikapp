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
  const [freeRequestsCount, setFreeRequestsCount] = useState<number | null>(null);
  const [hasFreeFeatures, setHasFreeFeatures] = useState<boolean>(true);
  const [featurePricing, setFeaturePricing] = useState<Record<string, any>>({});
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  
  const { toast } = useToast();
  const { generateInvoice } = useInvoiceGeneration();
  const { 
    createFeatureOrder, 
    updateOrderInvoiceUrl, 
    updateListingFeatureStatus,
    getFeatureRequestCount,
    getFeaturePrice
  } = useOrderManagement();

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFeatureOptions = (): FeatureOption[] => {
    return [
      {
        id: "homepage",
        title: "Homepage Feature",
        description: "Your listing will be featured on our homepage",
        price: hasFreeFeatures ? 0 : (featurePricing?.homepage?.price || 499),
        originalPrice: featurePricing?.homepage?.original_price || 499,
        iconType: 'home'
      },
      {
        id: "productPage",
        title: "Category Feature",
        description: "Your listing will be featured in its category page",
        price: hasFreeFeatures ? 0 : (featurePricing?.productPage?.price || 299),
        originalPrice: featurePricing?.productPage?.original_price || 299,
        iconType: 'tag'
      },
      {
        id: "both",
        title: "Premium Feature",
        description: "Your listing will be featured everywhere!",
        price: hasFreeFeatures ? 0 : (featurePricing?.both?.price || 799),
        originalPrice: featurePricing?.both?.original_price || 799,
        iconType: 'shopping-bag'
      }
    ];
  };

  const loadUserFeaturesStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setIsLoadingPricing(true);
      const count = await getFeatureRequestCount(session.user.id);
      setFreeRequestsCount(count);
      setHasFreeFeatures(count < 3);

      const { data: listing } = await supabase
        .from('listings')
        .select('category, subcategory')
        .eq('id', productId)
        .single();

      if (listing) {
        const homepagePrice = await getFeaturePrice(listing.category, listing.subcategory, 'homepage');
        const productPagePrice = await getFeaturePrice(listing.category, listing.subcategory, 'productPage');
        const bothPrice = await getFeaturePrice(listing.category, listing.subcategory, 'both');

        setFeaturePricing({
          homepage: homepagePrice,
          productPage: productPagePrice,
          both: bothPrice
        });
      }
    } catch (error: any) {
      console.error("Failed to load features status:", error);
      toast({
        title: "Error",
        description: "Failed to check feature availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPricing(false);
    }
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
      
      const userHasFreeFeatures = await getFeatureRequestCount(session.user.id) < 3;
      
      const actualPrice = userHasFreeFeatures ? 0 : selectedFeatureOption.price;
      const paymentStatus = actualPrice === 0 ? "completed" : "pending";
      
      const orderData = {
        listing_id: productId,
        buyer_id: session.user.id,
        seller_id: session.user.id,
        amount: actualPrice,
        payment_status: paymentStatus,
        invoice_number: invoiceNumber,
        order_type: "feature",
        feature_type: selectedOption,
        contact_name: userDetails.name,
        contact_phone: userDetails.phone,
        contact_address: userDetails.address
      };

      const orderResult = await createFeatureOrder(orderData);
      
      if (orderResult && orderResult.id) {
        const invoiceUrl = await generateInvoice(
          orderResult,
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
        description: userHasFreeFeatures 
          ? "Your listing has been submitted for featuring. An admin will review and approve it soon." 
          : "Your feature request has been submitted. Please proceed with payment to activate the feature.",
        variant: "default",
      });
      
      loadUserFeaturesStatus();
      
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
    loadUserFeaturesStatus();
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
    freeRequestsCount,
    hasFreeFeatures,
    isLoadingPricing,
    featurePricing,
    handleUserDetailsChange,
    handleNext,
    handleDetailsNext,
    handleDownloadInvoice,
    loadUserFeaturesStatus,
    getFeatureOptions
  };
}
