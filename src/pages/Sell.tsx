
import { useState, useCallback, useEffect } from "react";
import SellStepOne from "@/components/sell/SellStepOne";
import SellStepTwo from "@/components/sell/SellStepTwo";
import ChatWindow from "@/components/chat/ChatWindow";
import { useLocation } from "@/contexts/LocationContext";
import { useListingForm } from "@/components/sell/useListingForm";
import ScrollToTop from "@/components/utils/ScrollToTop";

const Sell = () => {
  const [step, setStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { selectedLocation } = useLocation();
  const {
    formData,
    setFormData,
    isSubmitting,
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    condition,
    setCondition,
    handleSubmit
  } = useListingForm();

  // Ensure the page scrolls to top when mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleStepOneComplete = useCallback((data: any) => {
    setFormData((prevData: any) => ({ ...prevData, ...data }));
    // Add RAF to smooth out the transition
    requestAnimationFrame(() => {
      setStep(2);
      window.scrollTo(0, 0);
    });
  }, [setFormData]);

  const handleBack = useCallback(() => {
    requestAnimationFrame(() => {
      setStep(1);
      window.scrollTo(0, 0);
    });
  }, []);

  const handleSubmitForm = useCallback((e: React.FormEvent) => {
    handleSubmit(e, selectedLocation);
  }, [handleSubmit, selectedLocation]);

  // Memoize the chat window to prevent unnecessary remounts
  const chatWindow = isChatOpen ? (
    <ChatWindow 
      isOpen={isChatOpen} 
      onClose={() => setIsChatOpen(false)} 
    />
  ) : null;

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <div className="relative">
        {step === 1 ? (
          <SellStepOne onNext={handleStepOneComplete} />
        ) : (
          <SellStepTwo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            condition={condition}
            setCondition={setCondition}
            isSubmitting={isSubmitting}
            onBack={handleBack}
            onSubmit={handleSubmitForm}
            category={formData.category}
            subcategory={formData.subcategory}
          />
        )}
      </div>
      {chatWindow}
    </div>
  );
};

export default Sell;
