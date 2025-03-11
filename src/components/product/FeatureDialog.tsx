
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
    freeRequestsCount,
    handleUserDetailsChange,
    handleNext,
    handleDetailsNext,
    handleDownloadInvoice,
    getFeatureOptions
  } = useFeatureRequest(productId, productTitle, onFeatureSuccess, onClose);

  const featureOptions = getFeatureOptions();

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
              featureOptions={featureOptions}
              freeRequestsCount={freeRequestsCount}
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
