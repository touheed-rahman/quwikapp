
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import FeatureOptionsStep from "./feature/FeatureOptionsStep";
import ContactDetailsStep from "./feature/ContactDetailsStep";
import FeatureSuccess from "./feature/FeatureSuccess";
import { useFeatureRequest } from "./feature/useFeatureRequest";
import { Home, ShoppingBag, Tag } from "lucide-react";
import { FeatureOption } from "./feature/types";

interface FeatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productId: string;
  category: string;
  subcategory: string;
  onFeatureSuccess: () => void;
}

export default function FeatureDialog({
  isOpen,
  onClose,
  productTitle,
  productId,
  onFeatureSuccess,
}: FeatureDialogProps) {
  const {
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
  } = useFeatureRequest(productId, productTitle, onFeatureSuccess, onClose);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {paymentComplete ? (
          <FeatureSuccess
            invoiceUrl={invoiceUrl}
            onDownloadInvoice={handleDownloadInvoice}
          />
        ) : step === 1 ? (
          <>
            <FeatureOptionsStep
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
            
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
            <ContactDetailsStep
              userDetails={userDetails}
              onUserDetailsChange={handleUserDetailsChange}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => handleDetailsNext(featureOptions)} 
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
