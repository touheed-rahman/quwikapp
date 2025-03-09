
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyFieldsProps {
  updateFormData: (fields: Record<string, any>) => void;
}

const PropertyFields = ({ updateFormData }: PropertyFieldsProps) => {
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [furnishing, setFurnishing] = useState("");

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    formFields.specs = {
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area_size: areaSize || null,
      furnishing: furnishing || null
    };
    
    updateFormData(formFields);
  }, [bedrooms, bathrooms, areaSize, furnishing, updateFormData]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Select 
          value={bedrooms} 
          onValueChange={setBedrooms}
        >
          <SelectTrigger id="bedrooms">
            <SelectValue placeholder="Select number of bedrooms" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Select 
          value={bathrooms} 
          onValueChange={setBathrooms}
        >
          <SelectTrigger id="bathrooms">
            <SelectValue placeholder="Select number of bathrooms" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="areaSize">Area Size</Label>
        <Input
          id="areaSize"
          type="text"
          placeholder="E.g., 1200 sq. ft."
          value={areaSize}
          onChange={(e) => setAreaSize(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="furnishing">Furnishing</Label>
        <Select 
          value={furnishing} 
          onValueChange={setFurnishing}
        >
          <SelectTrigger id="furnishing">
            <SelectValue placeholder="Select furnishing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="furnished">Fully Furnished</SelectItem>
            <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
            <SelectItem value="unfurnished">Unfurnished</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PropertyFields;
