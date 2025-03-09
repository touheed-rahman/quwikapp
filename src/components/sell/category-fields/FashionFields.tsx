
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FashionFieldsProps {
  updateFormData: (fields: Record<string, any>) => void;
}

const FashionFields = ({ updateFormData }: FashionFieldsProps) => {
  const [size, setSize] = useState("");
  const [styleType, setStyleType] = useState("");

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    formFields.specs = {
      size: size || null,
      style: styleType || null
    };
    
    updateFormData(formFields);
  }, [size, styleType, updateFormData]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          type="text"
          placeholder="E.g., S, M, L, XL, 32, 34"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="styleType">Style</Label>
        <Input
          id="styleType"
          type="text"
          placeholder="E.g., Casual, Formal, Sports"
          value={styleType}
          onChange={(e) => setStyleType(e.target.value)}
        />
      </div>
    </>
  );
};

export default FashionFields;
