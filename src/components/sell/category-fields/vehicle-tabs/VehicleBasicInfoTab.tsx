
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useEffect } from "react";

interface VehicleBasicInfoTabProps {
  kmDriven: string;
  setKmDriven: (value: string) => void;
  yearManufactured: string;
  setYearManufactured: (value: string) => void;
  fuelType: string;
  setFuelType: (value: string) => void;
  transmission: string;
  setTransmission: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  engineCapacity: string;
  setEngineCapacity: (value: string) => void;
  makeMonth: string;
  setMakeMonth: (value: string) => void;
  registrationPlace: string;
  setRegistrationPlace: (value: string) => void;
  insuranceType: string;
  setInsuranceType: (value: string) => void;
  isCar?: boolean;
  isBike?: boolean;
  isCommercial?: boolean;
}

const VehicleBasicInfoTab = ({
  kmDriven,
  setKmDriven,
  yearManufactured,
  setYearManufactured,
  fuelType,
  setFuelType,
  transmission,
  setTransmission,
  color,
  setColor,
  engineCapacity,
  setEngineCapacity,
  makeMonth,
  setMakeMonth,
  registrationPlace,
  setRegistrationPlace,
  insuranceType,
  setInsuranceType,
  isCar = false,
  isBike = false,
  isCommercial = false
}: VehicleBasicInfoTabProps) => {
  // The current year for the manufacturing year dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  // Months for the make month dropdown
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Set default km to 1 if it's empty or 0
  useEffect(() => {
    if (!kmDriven || kmDriven === "0") {
      setKmDriven("1");
    }
  }, [kmDriven, setKmDriven]);

  const renderFieldWithTooltip = (
    label: string, 
    id: string, 
    children: React.ReactNode, 
    tooltip: string,
    required: boolean = false
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className={required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""}>
          {label}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={14} className="text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );

  const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    // Set to 1 if the value is empty, 0, or not a valid number
    if (!value || value === "0" || isNaN(numValue)) {
      setKmDriven("1");
    } else {
      setKmDriven(value);
    }
  };

  return (
    <div className="space-y-4">
      {renderFieldWithTooltip(
        "Kilometers Driven", 
        "kmDriven", 
        <Input
          id="kmDriven"
          type="number"
          placeholder="Enter kilometers driven"
          value={kmDriven}
          onChange={handleKmChange}
          min="1"
          required
          className={(parseInt(kmDriven) <= 0 || !kmDriven) ? "border-red-300 focus:ring-red-500" : ""}
        />,
        "Total distance the vehicle has been driven in kilometers. This field is required.",
        true
      )}
      
      {renderFieldWithTooltip(
        "Year of Manufacture", 
        "yearManufactured", 
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
        </Select>,
        "The year when the vehicle was manufactured"
      )}
      
      {renderFieldWithTooltip(
        "Make Month", 
        "makeMonth", 
        <Select 
          value={makeMonth} 
          onValueChange={setMakeMonth}
        >
          <SelectTrigger id="makeMonth">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>,
        "The month when the vehicle was manufactured"
      )}
      
      {renderFieldWithTooltip(
        "Fuel Type", 
        "fuelType", 
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
        </Select>,
        "The type of fuel the vehicle uses"
      )}
      
      {(isCar || isBike) && renderFieldWithTooltip(
        "Transmission", 
        "transmission", 
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
        </Select>,
        "The type of transmission system in the vehicle"
      )}
      
      {renderFieldWithTooltip(
        "Color", 
        "color", 
        <Input
          id="color"
          type="text"
          placeholder="Enter vehicle color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />,
        "The exterior color of the vehicle"
      )}
      
      {(isCar || isBike) && renderFieldWithTooltip(
        "Engine Capacity (cc)", 
        "engineCapacity", 
        <Input
          id="engineCapacity"
          type="number"
          placeholder="Enter engine capacity in cc"
          value={engineCapacity}
          onChange={(e) => setEngineCapacity(e.target.value)}
          min="0"
        />,
        "The engine capacity in cubic centimeters (cc)"
      )}
      
      {renderFieldWithTooltip(
        "Registration Place", 
        "registrationPlace", 
        <Input
          id="registrationPlace"
          type="text"
          placeholder="Enter registration place"
          value={registrationPlace}
          onChange={(e) => setRegistrationPlace(e.target.value)}
        />,
        "The location where the vehicle is registered"
      )}
      
      {renderFieldWithTooltip(
        "Insurance Type", 
        "insuranceType", 
        <Select 
          value={insuranceType} 
          onValueChange={setInsuranceType}
        >
          <SelectTrigger id="insuranceType">
            <SelectValue placeholder="Select insurance type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comprehensive">Comprehensive</SelectItem>
            <SelectItem value="third-party">Third Party</SelectItem>
            <SelectItem value="none">No Insurance</SelectItem>
          </SelectContent>
        </Select>,
        "The type of insurance coverage for the vehicle"
      )}
    </div>
  );
};

export default VehicleBasicInfoTab;
