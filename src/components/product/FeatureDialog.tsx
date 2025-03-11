import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Home, Tag, ShoppingBag, Download } from "lucide-react";
import { generateInvoicePDF } from "@/utils/pdfUtils";

interface FeatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productId: string;
  category: string;
  subcategory: string;
  onFeatureSuccess: () => void;
}

interface FeatureOption {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  icon: React.ReactNode;
}

interface UserDetails {
  name: string;
  phone: string;
  address: string;
}

export default function FeatureDialog({
  isOpen,
  onClose,
  productTitle,
  productId,
  category,
  subcategory,
  onFeatureSuccess,
}: FeatureDialogProps) {
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

  // Feature options with both paid and free options
  const getFeaturePricing = (): FeatureOption[] => {
    return [
      {
        id: "homepage",
        title: "Homepage Feature",
        description: "Your listing will be featured on our homepage",
        price: 0,
        originalPrice: 499,
        icon: <Home className="h-5 w-5 text-secondary" />
      },
      {
        id: "productPage",
        title: "Category Feature",
        description: "Your listing will be featured in its category page",
        price: 0,
        originalPrice: 299,
        icon: <Tag className="h-5 w-5 text-primary" />
      },
      {
        id: "both",
        title: "Premium Feature",
        description: "Your listing will be featured everywhere!",
        price: 0,
        originalPrice: 799,
        icon: <ShoppingBag className="h-5 w-5 text-accent" />
      }
    ];
  };

  const featureOptions = getFeaturePricing();

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

  const handleDetailsNext = () => {
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
    handleSubmitFeatureRequest();
  };

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateInvoice = async (order: any) => {
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
            originalPrice: featureOptions.find(o => o.id === selectedOption)?.originalPrice || 0
          }
        ],
        total: 0,
        companyName: "Quwik",
        companyAddress: "Bangalore, India",
        discount: featureOptions.find(o => o.id === selectedOption)?.originalPrice || 0
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

  const handleSubmitFeatureRequest = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // First, update the listing with feature information
      const { error } = await supabase
        .from("listings")
        .update({
          featured_requested: true,
          feature_plan: selectedOption,
          feature_requested_at: new Date().toISOString()
        })
        .eq("id", productId);

      if (error) throw error;

      // Generate a free invoice record
      const invoiceNumber = `INV-${Date.now().toString().substring(7)}`;
      
      // Use direct fetch with the REST API to create the order
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgrtrdwvkkhraizqukwt.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncnRyZHd2a2tocmFpenF1a3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjE2NTIsImV4cCI6MjA1MzYzNzY1Mn0.mnC-NB_broDr4nOHggi0ngeDC1CxZsda6X-wyEMD2tE';
      
      // Create order data without the problematic fields
      const orderData = {
        product_id: productId,
        buyer_id: session.user.id,
        seller_id: session.user.id,
        amount: 0,
        payment_status: "completed",
        invoice_number: invoiceNumber,
        order_type: "feature",
        feature_plan: selectedOption,
        contact_name: userDetails.name,
        contact_phone: userDetails.phone,
        contact_address: userDetails.address
      };
      
      // Create order
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
        console.error("Order creation error:", errorData);
        throw new Error('Failed to create order: ' + (errorData.message || createOrderResponse.statusText));
      }

      const orderResult = await createOrderResponse.json();
      
      // Generate and upload invoice
      const invoiceUrl = await generateInvoice({
        ...orderData,
        id: orderResult[0]?.id
      });
      
      if (invoiceUrl) {
        // Update order with invoice URL
        await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderResult[0]?.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ 
            invoice_url: invoiceUrl 
          })
        });
        
        setInvoiceUrl(invoiceUrl);
      }

      setPaymentComplete(true);
      toast({
        title: "Feature Request Submitted!",
        description: "Your listing has been submitted for featuring. An admin will review and approve it soon.",
        variant: "default",
      });
      
      // Wait a moment to show success state before closing
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

  const handleDownloadInvoice = () => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {paymentComplete ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Request Submitted!</h2>
            <p className="text-center text-muted-foreground mb-6">
              Your free featured listing will be active soon after admin review.
            </p>
            
            {invoiceUrl && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 mb-4"
                onClick={handleDownloadInvoice}
              >
                <Download className="h-4 w-4" /> Download Invoice
              </Button>
            )}
          </div>
        ) : step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Feature Your Listing</DialogTitle>
              <DialogDescription>
                Make your listing stand out by featuring it on our platform
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              {featureOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedOption === option.id 
                      ? 'border-primary ring-2 ring-primary/30' 
                      : 'hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">Free!</div>
                      <div className="text-sm text-muted-foreground line-through">₹{option.originalPrice}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!selectedOption}
              >
                Next
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Contact Details</DialogTitle>
              <DialogDescription>
                Please provide your contact information for this featured listing
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Your full name" 
                  value={userDetails.name}
                  onChange={handleUserDetailsChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="Your phone number" 
                  value={userDetails.phone}
                  onChange={handleUserDetailsChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  placeholder="Your address" 
                  value={userDetails.address}
                  onChange={handleUserDetailsChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={handleDetailsNext} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
