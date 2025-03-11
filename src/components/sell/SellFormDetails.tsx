
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
import { Check } from "lucide-react";

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
      <Card className="bg-white rounded-lg shadow-md border-primary/10 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/10">
          <h3 className="font-medium text-lg flex items-center text-primary/90">
            <Check className="w-5 h-5 mr-2 text-primary" />
            Item Details
          </h3>
        </div>
        
        <div className="p-5 space-y-6">
          <motion.div variants={item} className="transition-all duration-300 hover:translate-y-[-2px]">
            <TitleInput value={title} onChange={setTitle} />
          </motion.div>
          
          <motion.div variants={item} className="transition-all duration-300 hover:translate-y-[-2px]">
            <DescriptionInput value={description} onChange={setDescription} />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item} className="transition-all duration-300 hover:translate-y-[-2px]">
              <ConditionSelect value={condition} onChange={setCondition} />
            </motion.div>
            
            <motion.div variants={item} className="transition-all duration-300 hover:translate-y-[-2px]">
              <PriceInput value={price} onChange={setPrice} />
            </motion.div>
          </div>
          
          {/* Only show category specific fields if we have both category and subcategory */}
          {category && subcategory && (
            <motion.div variants={item} className="transition-all duration-300 hover:translate-y-[-2px]">
              <CategorySpecificFields 
                category={category} 
                subcategory={subcategory}
                updateFormData={updateFormData}
              />
            </motion.div>
          )}
          
          <motion.div variants={item} className="transition-all duration-300 hover:translate-y-[-2px]">
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
        </div>
      </Card>
      
      <motion.div variants={item}>
        <FormActions isSubmitting={isSubmitting} onBack={onBack} />
      </motion.div>
    </motion.form>
  );
};

export default SellFormDetails;
