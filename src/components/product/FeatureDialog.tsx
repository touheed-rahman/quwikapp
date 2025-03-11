
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
import { Input } from "@/components/ui/input";
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
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    address: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });
  const [step, setStep] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();

  const getFeaturePricing = (): FeatureOption[] => {
    // Different pricing based on category
    let basePricing = {
      homepage: 59,
      productPage: 49,
      both: 79
    };
    
    // Adjust pricing for premium categories
    if (['electronics', 'vehicles', 'property'].includes(category)) {
      basePricing = {
        homepage: 79,
        productPage: 69,
        both: 99
      };
    } else if (['fashion', 'furniture'].includes(category)) {
      basePricing = {
        homepage: 49,
        productPage: 39,
        both: 69
      };
    }

    return [
      {
        id: "homepage",
        title: "Homepage Feature",
        description: "Your listing will be featured on our homepage",
        price: basePricing.homepage,
        icon: <Home className="h-5 w-5 text-secondary" />
      },
      {
        id: "productPage",
        title: "Category Feature",
        description: "Your listing will be featured in its category page",
        price: basePricing.productPage,
        icon: <Tag className="h-5 w-5 text-primary" />
      },
      {
        id: "both",
        title: "Premium Feature",
        description: "Your listing will be featured everywhere!",
        price: basePricing.both,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // Simulating payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set the request flag instead of directly featuring the listing
      const { error } = await supabase
        .from("listings")
        .update({
          featured_requested: true,
          feature_plan: selectedOption,
          feature_requested_at: new Date().toISOString()
        })
        .eq("id", productId);

      if (error) throw error;

      setPaymentComplete(true);
      toast({
        title: "Payment Successful!",
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
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {paymentComplete ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-center text-muted-foreground mb-6">
              Your listing will be featured soon after admin review.
            </p>
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
                    <div className="text-lg font-bold text-primary">₹{option.price}</div>
                  </div>
                </Card>
              ))}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={!selectedOption}>
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Payment Information</DialogTitle>
              <DialogDescription>
                Enter your details to complete the feature process
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input
                  id="name"
                  name="name"
                  value={paymentInfo.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="text-sm font-medium">Billing Address</label>
                <Input
                  id="address"
                  name="address"
                  value={paymentInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cardNumber" className="text-sm font-medium">Card Number</label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handleInputChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expDate" className="text-sm font-medium">Expiration Date</label>
                  <Input
                    id="expDate"
                    name="expDate"
                    value={paymentInfo.expDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="text-sm font-medium">CVV</label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handleInputChange}
                    placeholder="XXX"
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Pay & Feature Now'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
