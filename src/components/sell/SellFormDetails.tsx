
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import ConditionSelect from "./ConditionSelect";
import PriceInput from "./PriceInput";
import FormActions from "./FormActions";
import LocationSelector from "@/components/LocationSelector";
import { useLocation } from "@/contexts/LocationContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}: SellFormDetailsProps) => {
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [kmDriven, setKmDriven] = useState("");
  const [brand, setBrand] = useState("");
  const [yearManufactured, setYearManufactured] = useState("");

  // Update form data in parent component
  useEffect(() => {
    if (category === 'vehicles' && window.formDataRef) {
      window.formDataRef.km_driven = kmDriven ? parseInt(kmDriven) : 0;
      window.formDataRef.brand = brand || null;
      window.formDataRef.specs = {
        ...window.formDataRef.specs,
        year: yearManufactured ? parseInt(yearManufactured) : null
      };
    } else if (category === 'electronics' && window.formDataRef) {
      window.formDataRef.brand = brand || null;
    }
  }, [kmDriven, brand, yearManufactured, category]);

  // Generate year options for vehicle manufacture year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-6">
        <TitleInput value={title} onChange={setTitle} />
        <DescriptionInput value={description} onChange={setDescription} />
        <ConditionSelect value={condition} onChange={setCondition} />
        <PriceInput value={price} onChange={setPrice} />
        
        {/* Category specific fields */}
        {category === 'vehicles' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="kmDriven">Kilometers Driven *</Label>
              <Input
                id="kmDriven"
                type="number"
                placeholder="Enter kilometers driven"
                value={kmDriven}
                onChange={(e) => setKmDriven(e.target.value)}
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleBrand">Brand *</Label>
              <Input
                id="vehicleBrand"
                type="text"
                placeholder="Enter vehicle brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearManufactured">Year of Manufacture *</Label>
              <Select 
                value={yearManufactured} 
                onValueChange={setYearManufactured}
              >
                <SelectTrigger id="yearManufactured">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {category === 'electronics' && (
          <div className="space-y-2">
            <Label htmlFor="electronicsBrand">Brand *</Label>
            <Input
              id="electronicsBrand"
              type="text"
              placeholder="Enter brand name"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>
        )}
        
        {category === 'furniture' && (
          <div className="space-y-2">
            <Label htmlFor="furnitureBrand">Brand (Optional)</Label>
            <Input
              id="furnitureBrand"
              type="text"
              placeholder="Enter brand name (if applicable)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        )}
        
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
      <FormActions isSubmitting={isSubmitting} onBack={onBack} />
    </form>
  );
};

export default SellFormDetails;
