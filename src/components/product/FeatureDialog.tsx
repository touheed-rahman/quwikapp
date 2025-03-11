
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
import { CheckCircle, Home, Tag, ShoppingBag } from "lucide-react";

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
  icon: React.ReactNode;
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
  const { toast } = useToast();

  // Now all feature options are free (0 rupees)
  const getFeaturePricing = (): FeatureOption[] => {
    return [
      {
        id: "homepage",
        title: "Homepage Feature",
        description: "Your listing will be featured on our homepage",
        price: 0,
        icon: <Home className="h-5 w-5 text-secondary" />
      },
      {
        id: "productPage",
        title: "Category Feature",
        description: "Your listing will be featured in its category page",
        price: 0,
        icon: <Tag className="h-5 w-5 text-primary" />
      },
      {
        id: "both",
        title: "Premium Feature",
        description: "Your listing will be featured everywhere!",
        price: 0,
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
    // Since we're skipping payment, we can directly submit the feature request
    handleSubmitFeatureRequest();
  };

  const handleSubmitFeatureRequest = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // Set the request flag directly without payment
      const { error } = await supabase
        .from("listings")
        .update({
          featured_requested: true,
          feature_plan: selectedOption,
          feature_requested_at: new Date().toISOString()
        })
        .eq("id", productId);

      if (error) throw error;

      // Generate a free invoice record - using rpc to avoid type issues
      const invoiceNumber = `INV-${Date.now().toString().substring(7)}`;
      
      // Use rpc to insert into orders table to avoid type issues
      const { error: orderError } = await supabase.rpc('create_feature_order', {
        p_product_id: productId,
        p_user_id: session.user.id,
        p_amount: 0,
        p_invoice_number: invoiceNumber,
        p_feature_plan: selectedOption
      });

      if (orderError) {
        console.error("Order creation error:", orderError);
        // Fallback approach - manual query if RPC fails
        await fetch(`${supabase.supabaseUrl}/rest/v1/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            product_id: productId,
            buyer_id: session.user.id,
            seller_id: session.user.id,
            amount: 0,
            payment_status: "completed",
            invoice_number: invoiceNumber,
            order_type: "feature",
            feature_plan: selectedOption
          })
        });
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
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
      console.error("Feature request error:", error);
    } finally {
      setIsSubmitting(false);
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
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Feature Your Listing</DialogTitle>
              <DialogDescription>
                Make your listing stand out by featuring it on our platform (currently free!)
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
                    <div className="text-lg font-bold text-green-600">Free!</div>
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
                disabled={!selectedOption || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
