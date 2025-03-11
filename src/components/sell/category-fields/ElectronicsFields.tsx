
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ElectronicsFieldsProps {
  updateFormData: (fields: Record<string, any>) => void;
  showBrand: boolean;
}

const ElectronicsFields = ({ updateFormData, showBrand }: ElectronicsFieldsProps) => {
  const [brand, setBrand] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [warranty, setWarranty] = useState("");

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    if (showBrand && brand) {
      formFields.brand = brand;
    }
    
    formFields.specs = {
      model_number: modelNumber || null,
      warranty: warranty || null
    };
    
    updateFormData(formFields);
  }, [brand, modelNumber, warranty, showBrand, updateFormData]);

  return (
    <>
      {showBrand && (
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-black">
            Brand
          </Label>
          <Input
            id="brand"
            type="text"
            placeholder="Enter brand name"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="text-black"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="modelNumber" className="text-black">Model Number</Label>
        <Input
          id="modelNumber"
          type="text"
          placeholder="Enter model number"
          value={modelNumber}
          onChange={(e) => setModelNumber(e.target.value)}
          className="text-black"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="warranty" className="text-black">Warranty Information</Label>
        <Input
          id="warranty"
          type="text"
          placeholder="E.g., 1 year manufacturer warranty"
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
          className="text-black"
        />
      </div>
    </>
  );
};

export default ElectronicsFields;
