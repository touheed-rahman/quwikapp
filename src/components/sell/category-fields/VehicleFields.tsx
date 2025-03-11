
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

interface VehicleFieldsProps {
  updateFormData: (fields: Record<string, any>) => void;
}

const VehicleFields = ({ updateFormData }: VehicleFieldsProps) => {
  const [kmDriven, setKmDriven] = useState("");
  const [yearManufactured, setYearManufactured] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");
  
  // The current year for the manufacturing year dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    formFields.km_driven = kmDriven ? parseInt(kmDriven) : 0;
    formFields.specs = {
      year: yearManufactured ? parseInt(yearManufactured) : null,
      fuel_type: fuelType || null,
      transmission: transmission || null,
      color: color || null
    };
    
    updateFormData(formFields);
  }, [kmDriven, yearManufactured, fuelType, transmission, color, updateFormData]);

  return (
    <>
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
      
      <div className="space-y-2">
        <Label htmlFor="fuelType">Fuel Type</Label>
        <Select 
          value={fuelType} 
          onValueChange={setFuelType}
        >
          <SelectTrigger id="fuelType">
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="petrol">Petrol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="cng">CNG</SelectItem>
            <SelectItem value="lpg">LPG</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transmission">Transmission</Label>
        <Select 
          value={transmission} 
          onValueChange={setTransmission}
        >
          <SelectTrigger id="transmission">
            <SelectValue placeholder="Select transmission type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="text"
          placeholder="Enter vehicle color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
    </>
  );
};

export default VehicleFields;
