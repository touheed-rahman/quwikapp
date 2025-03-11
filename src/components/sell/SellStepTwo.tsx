
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="transition-opacity duration-200 bg-gradient-to-b from-background to-primary/5 min-h-screen">
      <div className="sticky top-0 z-10 bg-background/95 border-b border-primary/10 shadow-sm">
        <Header />
      </div>
      
      <div className="container max-w-2xl mx-auto px-4 pt-4 pb-24">
        <motion.div 
          className="text-center mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-2 mb-3">
            <ListChecks className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Tell Us About Your Item
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Add details about your item to help buyers find it
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
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
