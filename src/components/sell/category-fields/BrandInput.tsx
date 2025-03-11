
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BrandInputProps {
  updateFormData: (fields: Record<string, any>) => void;
}

const BrandInput = ({ updateFormData }: BrandInputProps) => {
  const [brand, setBrand] = useState("");

  // Update parent component when values change
  useEffect(() => {
    if (brand) {
      updateFormData({ brand });
    }
  }, [brand, updateFormData]);

  return (
    <div className="space-y-2.5">
      <Label htmlFor="brand" className="text-sm font-medium">
        Brand
      </Label>
      <Input
        id="brand"
        type="text"
        placeholder="Enter brand name"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="px-4 py-2.5 focus:ring-primary focus:border-primary"
      />
    </div>
  );
};

export default BrandInput;
