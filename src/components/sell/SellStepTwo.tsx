
import { memo } from "react";
import Header from "@/components/Header";
import SellFormDetails from "./SellFormDetails";
import { useLocation } from "@/contexts/LocationContext";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

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
    <div className="transition-opacity duration-200 bg-gradient-to-b from-background to-primary/5 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-4 pt-20 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4 flex items-center justify-center"
        >
          <div className="bg-primary/10 rounded-full px-4 py-2 inline-flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-primary" />
            <span className="font-medium text-primary">Step 2: Item Details</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl mx-auto"
        >
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
        </motion.div>
      </div>
    </div>
  );
});

SellStepTwo.displayName = "SellStepTwo";

export default SellStepTwo;
