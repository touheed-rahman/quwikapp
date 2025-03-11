
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
    loadUserFeaturesStatus,
    getFeatureOptions
  } = useFeatureRequest(productId, productTitle, onFeatureSuccess, onClose);

  // Load user features status when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadUserFeaturesStatus();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
                onClick={() => handleDetailsNext(getFeatureOptions())} 
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
