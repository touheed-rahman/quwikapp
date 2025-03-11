
import { memo } from "react";
import Header from "@/components/Header";
import SellFormDetails from "./SellFormDetails";
import { useLocation } from "@/contexts/LocationContext";
import { motion } from "framer-motion";

interface SellStepTwoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  category?: string;
  subcategory?: string;
}

const SellStepTwo = memo(({
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  condition,
  setCondition,
  isSubmitting,
  onBack,
  onSubmit,
  category,
  subcategory
}: SellStepTwoProps) => {
  const { selectedLocation } = useLocation();

  return (
    <div className="transition-opacity duration-200">
      <Header />
      <div className="container max-w-2xl mx-auto px-4 pt-20 pb-24">
        <motion.h1 
          className="text-2xl font-bold mb-6 text-foreground flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Item Details
        </motion.h1>
        <SellFormDetails
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          condition={condition}
          setCondition={setCondition}
          isSubmitting={isSubmitting}
          onBack={onBack}
          onSubmit={onSubmit}
          category={category}
          subcategory={subcategory}
        />
      </div>
    </div>
  );
});

SellStepTwo.displayName = "SellStepTwo";

export default SellStepTwo;
