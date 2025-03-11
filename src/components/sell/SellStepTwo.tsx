
import { memo } from "react";
import Header from "@/components/Header";
import SellFormDetails from "./SellFormDetails";
import { useLocation } from "@/contexts/LocationContext";
import { motion } from "framer-motion";
import { Pencil, ListChecks } from "lucide-react";

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
      <div className="container max-w-2xl mx-auto px-4 pt-16 pb-24">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-2 mb-4">
            <ListChecks className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Tell Us About Your Item
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Add details about your item to help buyers find it
          </p>
        </motion.div>
        
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
