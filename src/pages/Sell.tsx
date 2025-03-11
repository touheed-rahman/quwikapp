
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import SellStepOne from "@/components/sell/SellStepOne";
import SellStepTwo from "@/components/sell/SellStepTwo";
import ChatWindow from "@/components/chat/ChatWindow";
import { useLocation } from "@/contexts/LocationContext";
import { useListingForm } from "@/components/sell/useListingForm";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

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
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      setStep(2);
    });
  }, [setFormData]);

  const handleBack = useCallback(() => {
    window.scrollTo(0, 0);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="sticky top-0 z-10 bg-background/95 border-b border-primary/10 shadow-sm">
        <Header />
      </div>
      
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full pt-20"
          >
            <div className="container mx-auto px-4 py-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-4 flex items-center justify-center"
              >
                <div className="bg-primary/10 rounded-full px-4 py-2 inline-flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium text-primary">Step 1: Upload Photos & Category</span>
                </div>
              </motion.div>
              <SellStepOne onNext={handleStepOneComplete} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
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
      {chatWindow}
    </div>
  );
};

export default Sell;
