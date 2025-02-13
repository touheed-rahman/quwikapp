
import { useState } from "react";
import SellStepOne from "@/components/sell/SellStepOne";
import SellStepTwo from "@/components/sell/SellStepTwo";
import ChatWindow from "@/components/chat/ChatWindow";
import { useLocation } from "@/contexts/LocationContext";
import { useListingForm } from "@/components/sell/useListingForm";

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

  const handleStepOneComplete = (data: any) => {
    setFormData({ ...formData, ...data });
    setTimeout(() => setStep(2), 0);
  };

  return (
    <div className="min-h-screen bg-background">
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
          onBack={() => setStep(1)}
          onSubmit={(e) => handleSubmit(e, selectedLocation)}
          category={formData.category}
        />
      )}
      {isChatOpen && <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default Sell;
