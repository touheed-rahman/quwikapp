
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import ConditionSelect from "./ConditionSelect";
import PriceInput from "./PriceInput";
import FormActions from "./FormActions";
import LocationSelector from "@/components/LocationSelector";
import { useLocation } from "@/contexts/LocationContext";

interface SellFormDetailsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
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
  location,
  setLocation,
  isSubmitting,
  onBack,
  onSubmit
}: SellFormDetailsProps) => {
  const { selectedLocation } = useLocation();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-6">
        <TitleInput value={title} onChange={setTitle} />
        <DescriptionInput value={description} onChange={setDescription} />
        <ConditionSelect value={condition} onChange={setCondition} />
        <PriceInput value={price} onChange={setPrice} />
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Location *
          </label>
          <LocationSelector 
            value={selectedLocation} 
            onChange={setLocation}
          />
        </div>
      </div>
      <FormActions isSubmitting={isSubmitting} onBack={onBack} />
    </form>
  );
};

export default SellFormDetails;
