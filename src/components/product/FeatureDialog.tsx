
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
import { useEffect } from "react";

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
  category,
  subcategory,
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
    freeRequestsCount,
    hasFreeFeatures,
    isLoadingPricing,
    featurePricing,
    handleUserDetailsChange,
    handleNext,
    handleDetailsNext,
    handleDownloadInvoice,
    loadUserFeaturesStatus
  } = useFeatureRequest(productId, productTitle, onFeatureSuccess, onClose);

  // Load user features status when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadUserFeaturesStatus();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Feature options with both paid and free options
  const getFeaturePricing = (): FeatureOption[] => {
    return [
      {
        id: "homepage",
        title: "Homepage Feature",
        description: "Your listing will be featured on our homepage",
        price: hasFreeFeatures ? 0 : (featurePricing?.homepage?.price || 499),
        originalPrice: featurePricing?.homepage?.original_price || 499,
        icon: <Home className="h-5 w-5 text-secondary" />
      },
      {
        id: "productPage",
        title: "Category Feature",
        description: "Your listing will be featured in its category page",
        price: hasFreeFeatures ? 0 : (featurePricing?.productPage?.price || 299),
        originalPrice: featurePricing?.productPage?.original_price || 299,
        icon: <Tag className="h-5 w-5 text-primary" />
      },
      {
        id: "both",
        title: "Premium Feature",
        description: "Your listing will be featured everywhere!",
        price: hasFreeFeatures ? 0 : (featurePricing?.both?.price || 799),
        originalPrice: featurePricing?.both?.original_price || 799,
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
              freeRequestsCount={freeRequestsCount}
              hasFreeFeatures={hasFreeFeatures}
              isLoadingPricing={isLoadingPricing}
              featurePricing={featurePricing}
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
                {isSubmitting ? 'Processing...' : hasFreeFeatures ? 'Submit Request' : 'Submit & Pay'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
