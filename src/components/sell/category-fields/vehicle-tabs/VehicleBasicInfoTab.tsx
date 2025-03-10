
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  setInsuranceType
}: VehicleBasicInfoTabProps) => {
  // The current year for the manufacturing year dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  // Months for the make month dropdown
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-4">
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
        <Label htmlFor="makeMonth">Make Month</Label>
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
      
      <div className="space-y-2">
        <Label htmlFor="engineCapacity">Engine Capacity (cc)</Label>
        <Input
          id="engineCapacity"
          type="number"
          placeholder="Enter engine capacity in cc"
          value={engineCapacity}
          onChange={(e) => setEngineCapacity(e.target.value)}
          min="0"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registrationPlace">Registration Place</Label>
        <Input
          id="registrationPlace"
          type="text"
          placeholder="Enter registration place"
          value={registrationPlace}
          onChange={(e) => setRegistrationPlace(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="insuranceType">Insurance Type</Label>
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
        </Select>
      </div>
    </div>
  );
};

export default VehicleBasicInfoTab;
