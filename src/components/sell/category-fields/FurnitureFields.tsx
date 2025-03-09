
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FurnitureFieldsProps {
  updateFormData: (fields: Record<string, any>) => void;
}

const FurnitureFields = ({ updateFormData }: FurnitureFieldsProps) => {
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    formFields.specs = {
      material: material || null,
      dimensions: dimensions || null
    };
    
    updateFormData(formFields);
  }, [material, dimensions, updateFormData]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="material">Material</Label>
        <Input
          id="material"
          type="text"
          placeholder="E.g., Wood, Metal, Glass"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dimensions">Dimensions</Label>
        <Input
          id="dimensions"
          type="text"
          placeholder="E.g., 120 x 60 x 75 cm (L x W x H)"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
        />
      </div>
    </>
  );
};

export default FurnitureFields;
