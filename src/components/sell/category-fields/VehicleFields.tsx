
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleFieldsProps {
  updateFormData: (fields: Record<string, any>) => void;
}

const VehicleFields = ({ updateFormData }: VehicleFieldsProps) => {
  const [kmDriven, setKmDriven] = useState("");
  const [yearManufactured, setYearManufactured] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");
  const [makeMonth, setMakeMonth] = useState("");
  const [registrationPlace, setRegistrationPlace] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  
  // Boolean fields
  const [abs, setAbs] = useState(false);
  const [accidental, setAccidental] = useState(false);
  const [adjustableExternalMirror, setAdjustableExternalMirror] = useState(false);
  const [adjustableSteering, setAdjustableSteering] = useState(false);
  const [airConditioning, setAirConditioning] = useState(false);
  const [alloyWheels, setAlloyWheels] = useState(false);
  const [antiTheftDevice, setAntiTheftDevice] = useState(false);
  const [auxCompatibility, setAuxCompatibility] = useState(false);
  const [bluetooth, setBluetooth] = useState(false);
  const [certified, setCertified] = useState(false);
  const [cruiseControl, setCruiseControl] = useState(false);
  const [navigationSystem, setNavigationSystem] = useState(false);
  const [parkingSensors, setParkingSensors] = useState(false);
  const [powerSteering, setPowerSteering] = useState(false);
  const [rearParkingCamera, setRearParkingCamera] = useState(false);
  const [sunroof, setSunroof] = useState(false);
  const [usbCompatibility, setUsbCompatibility] = useState(false);
  const [exchange, setExchange] = useState(false);
  const [radio, setRadio] = useState(false);
  
  // Additional fields
  const [airbags, setAirbags] = useState("");
  const [batteryCondition, setBatteryCondition] = useState("");
  const [tyreCondition, setTyreCondition] = useState("");
  const [lockSystem, setLockSystem] = useState("");
  const [serviceHistory, setServiceHistory] = useState("");
  const [powerWindows, setPowerWindows] = useState("");
  
  // The current year for the manufacturing year dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  // Months for the make month dropdown
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    formFields.km_driven = kmDriven ? parseInt(kmDriven) : 0;
    formFields.specs = {
      // Basic information
      year: yearManufactured ? parseInt(yearManufactured) : null,
      fuel_type: fuelType || null,
      transmission: transmission || null,
      color: color || null,
      engine_capacity: engineCapacity ? parseInt(engineCapacity) : null,
      make_month: makeMonth || null,
      registration_place: registrationPlace || null,
      insurance_type: insuranceType || null,
      
      // Boolean fields
      abs: abs,
      accidental: accidental,
      adjustable_external_mirror: adjustableExternalMirror,
      adjustable_steering: adjustableSteering,
      air_conditioning: airConditioning,
      alloy_wheels: alloyWheels,
      anti_theft_device: antiTheftDevice,
      aux_compatibility: auxCompatibility,
      bluetooth: bluetooth,
      certified: certified,
      cruise_control: cruiseControl,
      navigation_system: navigationSystem,
      parking_sensors: parkingSensors,
      power_steering: powerSteering,
      rear_parking_camera: rearParkingCamera,
      sunroof: sunroof,
      usb_compatibility: usbCompatibility,
      exchange: exchange,
      radio: radio,
      
      // Additional fields
      airbags: airbags || null,
      battery_condition: batteryCondition || null,
      tyre_condition: tyreCondition || null,
      lock_system: lockSystem || null,
      service_history: serviceHistory || null,
      power_windows: powerWindows || null,
    };
    
    updateFormData(formFields);
  }, [
    kmDriven, yearManufactured, fuelType, transmission, color, 
    engineCapacity, makeMonth, registrationPlace, insuranceType,
    abs, accidental, adjustableExternalMirror, adjustableSteering, 
    airConditioning, alloyWheels, antiTheftDevice, auxCompatibility, 
    bluetooth, certified, cruiseControl, navigationSystem, parkingSensors, 
    powerSteering, rearParkingCamera, sunroof, usbCompatibility, exchange, radio,
    airbags, batteryCondition, tyreCondition, lockSystem, serviceHistory, powerWindows,
    updateFormData
  ]);

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="safety">Safety</TabsTrigger>
        <TabsTrigger value="additional">Additional</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
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
      </TabsContent>
      
      <TabsContent value="features" className="space-y-4">
        <div className="space-y-2">
          <Label>Interior & Comfort</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="airConditioning" 
                checked={airConditioning}
                onCheckedChange={(checked) => setAirConditioning(checked as boolean)}
              />
              <label htmlFor="airConditioning" className="text-sm cursor-pointer">
                Air Conditioning
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="powerSteering" 
                checked={powerSteering}
                onCheckedChange={(checked) => setPowerSteering(checked as boolean)}
              />
              <label htmlFor="powerSteering" className="text-sm cursor-pointer">
                Power Steering
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="adjustableSteering" 
                checked={adjustableSteering}
                onCheckedChange={(checked) => setAdjustableSteering(checked as boolean)}
              />
              <label htmlFor="adjustableSteering" className="text-sm cursor-pointer">
                Adjustable Steering
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cruiseControl" 
                checked={cruiseControl}
                onCheckedChange={(checked) => setCruiseControl(checked as boolean)}
              />
              <label htmlFor="cruiseControl" className="text-sm cursor-pointer">
                Cruise Control
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sunroof" 
                checked={sunroof}
                onCheckedChange={(checked) => setSunroof(checked as boolean)}
              />
              <label htmlFor="sunroof" className="text-sm cursor-pointer">
                Sunroof
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="adjustableExternalMirror" 
                checked={adjustableExternalMirror}
                onCheckedChange={(checked) => setAdjustableExternalMirror(checked as boolean)}
              />
              <label htmlFor="adjustableExternalMirror" className="text-sm cursor-pointer">
                Adjustable External Mirror
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="powerWindows">Power Windows</Label>
          <Select 
            value={powerWindows} 
            onValueChange={setPowerWindows}
          >
            <SelectTrigger id="powerWindows">
              <SelectValue placeholder="Select power windows option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="front-only">Front Only</SelectItem>
              <SelectItem value="rear-only">Rear Only</SelectItem>
              <SelectItem value="front-and-rear">Front & Rear</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Entertainment & Connectivity</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bluetooth" 
                checked={bluetooth}
                onCheckedChange={(checked) => setBluetooth(checked as boolean)}
              />
              <label htmlFor="bluetooth" className="text-sm cursor-pointer">
                Bluetooth
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auxCompatibility" 
                checked={auxCompatibility}
                onCheckedChange={(checked) => setAuxCompatibility(checked as boolean)}
              />
              <label htmlFor="auxCompatibility" className="text-sm cursor-pointer">
                AUX Compatibility
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="usbCompatibility" 
                checked={usbCompatibility}
                onCheckedChange={(checked) => setUsbCompatibility(checked as boolean)}
              />
              <label htmlFor="usbCompatibility" className="text-sm cursor-pointer">
                USB Compatibility
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="radio" 
                checked={radio}
                onCheckedChange={(checked) => setRadio(checked as boolean)}
              />
              <label htmlFor="radio" className="text-sm cursor-pointer">
                AM/FM Radio
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="navigationSystem" 
                checked={navigationSystem}
                onCheckedChange={(checked) => setNavigationSystem(checked as boolean)}
              />
              <label htmlFor="navigationSystem" className="text-sm cursor-pointer">
                Navigation System
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Exterior</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="alloyWheels" 
                checked={alloyWheels}
                onCheckedChange={(checked) => setAlloyWheels(checked as boolean)}
              />
              <label htmlFor="alloyWheels" className="text-sm cursor-pointer">
                Alloy Wheels
              </label>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="safety" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="airbags">Number of Airbags</Label>
          <Select 
            value={airbags} 
            onValueChange={setAirbags}
          >
            <SelectTrigger id="airbags">
              <SelectValue placeholder="Select number of airbags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="8+">8+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Safety Features</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="abs" 
                checked={abs}
                onCheckedChange={(checked) => setAbs(checked as boolean)}
              />
              <label htmlFor="abs" className="text-sm cursor-pointer">
                ABS
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="antiTheftDevice" 
                checked={antiTheftDevice}
                onCheckedChange={(checked) => setAntiTheftDevice(checked as boolean)}
              />
              <label htmlFor="antiTheftDevice" className="text-sm cursor-pointer">
                Anti Theft Device
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="parkingSensors" 
                checked={parkingSensors}
                onCheckedChange={(checked) => setParkingSensors(checked as boolean)}
              />
              <label htmlFor="parkingSensors" className="text-sm cursor-pointer">
                Parking Sensors
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rearParkingCamera" 
                checked={rearParkingCamera}
                onCheckedChange={(checked) => setRearParkingCamera(checked as boolean)}
              />
              <label htmlFor="rearParkingCamera" className="text-sm cursor-pointer">
                Rear Parking Camera
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lockSystem">Lock System</Label>
          <Select 
            value={lockSystem} 
            onValueChange={setLockSystem}
          >
            <SelectTrigger id="lockSystem">
              <SelectValue placeholder="Select lock system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote-controlled-central">Remote Controlled Central</SelectItem>
              <SelectItem value="central-locking">Central Locking</SelectItem>
              <SelectItem value="keyless-entry">Keyless Entry</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      
      <TabsContent value="additional" className="space-y-4">
        <div className="space-y-2">
          <Label>Vehicle History</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="accidental" 
                checked={accidental}
                onCheckedChange={(checked) => setAccidental(checked as boolean)}
              />
              <label htmlFor="accidental" className="text-sm cursor-pointer">
                Has Accident History
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="certified" 
                checked={certified}
                onCheckedChange={(checked) => setCertified(checked as boolean)}
              />
              <label htmlFor="certified" className="text-sm cursor-pointer">
                Vehicle Certified
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serviceHistory">Service History</Label>
          <Select 
            value={serviceHistory} 
            onValueChange={setServiceHistory}
          >
            <SelectTrigger id="serviceHistory">
              <SelectValue placeholder="Select service history" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="not-available">Not Available</SelectItem>
              <SelectItem value="dealer-serviced">Dealer Serviced</SelectItem>
              <SelectItem value="local-serviced">Local Serviced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="batteryCondition">Battery Condition</Label>
          <Select 
            value={batteryCondition} 
            onValueChange={setBatteryCondition}
          >
            <SelectTrigger id="batteryCondition">
              <SelectValue placeholder="Select battery condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="needs-replacement">Needs Replacement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tyreCondition">Tyre Condition</Label>
          <Select 
            value={tyreCondition} 
            onValueChange={setTyreCondition}
          >
            <SelectTrigger id="tyreCondition">
              <SelectValue placeholder="Select tyre condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="needs-replacement">Needs Replacement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Other</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="exchange" 
                checked={exchange}
                onCheckedChange={(checked) => setExchange(checked as boolean)}
              />
              <label htmlFor="exchange" className="text-sm cursor-pointer">
                Exchange Available
              </label>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default VehicleFields;
