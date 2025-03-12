
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import ConditionSelect from "./ConditionSelect";
import PriceInput from "./PriceInput";
import FormActions from "./FormActions";
import LocationSelector from "@/components/LocationSelector";
import { useLocation } from "@/contexts/LocationContext";
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

  return (
    <motion.form 
      onSubmit={onSubmit} 
      className="w-full space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="bg-white rounded-lg shadow-md border-primary/10 overflow-hidden w-full">
        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/10">
          <h3 className="font-medium text-lg flex items-center text-primary/90">
            <Check className="w-5 h-5 mr-2 text-primary" />
            Item Details
          </h3>
        </div>
        
        <div className="p-5 space-y-6 w-full">
          <div className="transition-all duration-300">
            <TitleInput value={title} onChange={setTitle} />
          </div>
          
          <div className="transition-all duration-300">
            <DescriptionInput value={description} onChange={setDescription} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="transition-all duration-300">
              <ConditionSelect value={condition} onChange={setCondition} />
            </div>
            
            <div className="transition-all duration-300">
              <PriceInput value={price} onChange={setPrice} />
            </div>
          </div>
          
          {/* Category specific fields removed temporarily */}
          
          <div className="transition-all duration-300">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Location *
              </label>
              <LocationSelector 
                value={selectedLocation} 
                onChange={setSelectedLocation}
              />
            </div>
          </div>
        </div>
      </Card>
      
      <div>
        <FormActions isSubmitting={isSubmitting} onBack={onBack} />
      </div>
    </motion.form>
  );
};

export default SellFormDetails;
