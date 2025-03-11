
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import ConditionSelect from "./ConditionSelect";
import PriceInput from "./PriceInput";
import FormActions from "./FormActions";
import LocationSelector from "@/components/LocationSelector";
import { useLocation } from "@/contexts/LocationContext";
import CategorySpecificFields from "./CategorySpecificFields";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface SellFormDetailsProps {
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

const SellFormDetails = ({
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
  subcategory,
}: SellFormDetailsProps) => {
  const { selectedLocation, setSelectedLocation } = useLocation();

  // Handle category-specific form updates
  const updateFormData = (fields: Record<string, any>) => {
    if (window.formDataRef) {
      window.formDataRef = {
        ...window.formDataRef,
        ...fields
      };
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.form 
      onSubmit={onSubmit} 
      className="space-y-6 max-w-3xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Card className="bg-white rounded-lg shadow-md p-6 space-y-6 border-primary/10">
        <motion.div variants={item}>
          <TitleInput value={title} onChange={setTitle} />
        </motion.div>
        
        <motion.div variants={item}>
          <DescriptionInput value={description} onChange={setDescription} />
        </motion.div>
        
        <motion.div variants={item}>
          <ConditionSelect value={condition} onChange={setCondition} />
        </motion.div>
        
        <motion.div variants={item}>
          <PriceInput value={price} onChange={setPrice} />
        </motion.div>
        
        {/* Only show category specific fields if we have both category and subcategory */}
        {category && subcategory && (
          <motion.div variants={item}>
            <CategorySpecificFields 
              category={category} 
              subcategory={subcategory}
              updateFormData={updateFormData}
            />
          </motion.div>
        )}
        
        <motion.div variants={item}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Location *
            </label>
            <LocationSelector 
              value={selectedLocation} 
              onChange={setSelectedLocation}
            />
          </div>
        </motion.div>
      </Card>
      
      <motion.div variants={item}>
        <FormActions isSubmitting={isSubmitting} onBack={onBack} />
      </motion.div>
    </motion.form>
  );
};

export default SellFormDetails;
