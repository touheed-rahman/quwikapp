
import { useState, useCallback } from "react";
import SellStepOne from "@/components/sell/SellStepOne";
import SellStepTwo from "@/components/sell/SellStepTwo";
import ChatWindow from "@/components/chat/ChatWindow";
import { useLocation } from "@/contexts/LocationContext";
import { useListingForm } from "@/components/sell/useListingForm";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

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

  const handleStepOneComplete = useCallback((data: any) => {
    setFormData((prevData: any) => ({ ...prevData, ...data }));
    requestAnimationFrame(() => {
      setStep(2);
    });
  }, [setFormData]);

  const handleBack = useCallback(() => {
    requestAnimationFrame(() => {
      setStep(1);
    });
  }, []);

  const handleSubmitForm = useCallback((e: React.FormEvent) => {
    handleSubmit(e, selectedLocation);
  }, [handleSubmit, selectedLocation]);

  const chatWindow = isChatOpen ? (
    <ChatWindow 
      isOpen={isChatOpen} 
      onClose={() => setIsChatOpen(false)} 
    />
  ) : null;

  const renderProgressIndicator = () => (
    <div className="flex justify-center max-w-md mx-auto mb-6">
      <div className="w-full bg-neutral-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: step === 1 ? '50%' : '100%' }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
        <Badge 
          variant="outline" 
          className="bg-white/90 backdrop-blur-sm border-primary/20 shadow-md px-4 py-1.5"
        >
          Step {step} of 2: {step === 1 ? 'Choose Category & Upload Images' : 'Fill Details'}
        </Badge>
      </div>
      
      <div className="pt-16 pb-10 px-4">
        {renderProgressIndicator()}
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SellStepOne onNext={handleStepOneComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {chatWindow}
    </div>
  );
};

export default Sell;
