
import { memo } from "react";
import Header from "@/components/Header";
import SellFormDetails from "./SellFormDetails";
import { useLocation } from "@/contexts/LocationContext";
import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";

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
      <div className="sticky top-0 z-10 bg-background/95 border-b border-primary/10 shadow-sm">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 pt-8 pb-24 w-full">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-foreground">
            Tell Us About Your Item
          </h1>
          <p className="text-muted-foreground mt-2">
            Add details about your item to help buyers find it
          </p>
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
