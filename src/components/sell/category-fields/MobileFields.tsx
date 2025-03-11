
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MobileFieldsProps {
  updateFormData: (fields: Record<string, any>) => void;
  showBrand: boolean;
}

const MobileFields = ({ updateFormData, showBrand }: MobileFieldsProps) => {
  const [brand, setBrand] = useState("");
  const [storage, setStorage] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    if (showBrand && brand) {
      formFields.brand = brand;
    }
    
    formFields.specs = {
      storage: storage || null,
      screen_size: screenSize || null,
      battery: batteryCapacity || null
    };
    
    updateFormData(formFields);
  }, [brand, storage, screenSize, batteryCapacity, showBrand, updateFormData]);

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
        <Label htmlFor="storage" className="text-black">Storage</Label>
        <Input
          id="storage"
          type="text"
          placeholder="E.g., 128GB, 256GB"
          value={storage}
          onChange={(e) => setStorage(e.target.value)}
          className="text-black"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="screenSize" className="text-black">Screen Size</Label>
        <Input
          id="screenSize"
          type="text"
          placeholder="E.g., 6.1 inches"
          value={screenSize}
          onChange={(e) => setScreenSize(e.target.value)}
          className="text-black"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="batteryCapacity" className="text-black">Battery Capacity</Label>
        <Input
          id="batteryCapacity"
          type="text"
          placeholder="E.g., 4000mAh"
          value={batteryCapacity}
          onChange={(e) => setBatteryCapacity(e.target.value)}
          className="text-black"
        />
      </div>
    </>
  );
};

export default MobileFields;
