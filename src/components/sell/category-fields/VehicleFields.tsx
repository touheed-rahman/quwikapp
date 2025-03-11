
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
import VehicleBasicInfoTab from "./vehicle-tabs/VehicleBasicInfoTab";
import VehicleFeaturesTab from "./vehicle-tabs/VehicleFeaturesTab";
import VehicleSafetyTab from "./vehicle-tabs/VehicleSafetyTab";
import VehicleAdditionalTab from "./vehicle-tabs/VehicleAdditionalTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface VehicleFieldsProps {
  updateFormData: (fields: Record<string, any>) => void;
  subcategory?: string;
}

const VehicleFields = ({ updateFormData, subcategory = "" }: VehicleFieldsProps) => {
  const { toast } = useToast();
  const [kmDriven, setKmDriven] = useState("1"); // Initialize with "1" as a minimum valid value
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

  // Determine which fields to show based on subcategory
  const isCar = subcategory === 'cars' || subcategory === 'luxury-cars';
  const isBike = subcategory === 'motorcycles' || subcategory === 'scooters';
  const isCommercial = subcategory === 'commercial-vehicles' || subcategory === 'transport-vehicles';

  // Update parent component when values change
  useEffect(() => {
    // Always ensure kmDriven is a number and valid (minimum 1)
    let kmDrivenNumber = 1; // Default to 1 as minimum valid value
    
    if (kmDriven && kmDriven.trim() !== "") {
      const parsed = parseInt(kmDriven, 10);
      if (!isNaN(parsed) && parsed > 0) {
        kmDrivenNumber = parsed;
      }
    }
    
    const formFields: Record<string, any> = {
      // CRITICAL: Always set km_driven as a number, minimum 1
      km_driven: kmDrivenNumber,
    };
    
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
      
      // Boolean fields - only include relevant ones based on subcategory
      abs: isCar || isBike ? abs : null,
      accidental: accidental,
      adjustable_external_mirror: isCar ? adjustableExternalMirror : null,
      adjustable_steering: isCar ? adjustableSteering : null,
      air_conditioning: isCar ? airConditioning : null,
      alloy_wheels: isCar || isBike ? alloyWheels : null,
      anti_theft_device: antiTheftDevice,
      aux_compatibility: isCar ? auxCompatibility : null,
      bluetooth: isCar ? bluetooth : null,
      certified: certified,
      cruise_control: isCar ? cruiseControl : null,
      navigation_system: isCar ? navigationSystem : null,
      parking_sensors: isCar ? parkingSensors : null,
      power_steering: isCar ? powerSteering : null,
      rear_parking_camera: isCar ? rearParkingCamera : null,
      sunroof: isCar ? sunroof : null,
      usb_compatibility: isCar ? usbCompatibility : null,
      exchange: exchange,
      radio: isCar ? radio : null,
      
      // Additional fields
      airbags: isCar ? airbags : null,
      battery_condition: batteryCondition || null,
      tyre_condition: tyreCondition || null,
      lock_system: lockSystem || null,
      service_history: serviceHistory || null,
      power_windows: isCar ? powerWindows : null,
    };
    
    // Log the form fields for debugging
    console.log("Vehicle form data:", formFields);
    
    updateFormData(formFields);
  }, [
    kmDriven, yearManufactured, fuelType, transmission, color, 
    engineCapacity, makeMonth, registrationPlace, insuranceType,
    abs, accidental, adjustableExternalMirror, adjustableSteering, 
    airConditioning, alloyWheels, antiTheftDevice, auxCompatibility, 
    bluetooth, certified, cruiseControl, navigationSystem, parkingSensors, 
    powerSteering, rearParkingCamera, sunroof, usbCompatibility, exchange, radio,
    airbags, batteryCondition, tyreCondition, lockSystem, serviceHistory, powerWindows,
    updateFormData, isCar, isBike, isCommercial
  ]);

  const vehicleStateProps = {
    kmDriven, setKmDriven,
    yearManufactured, setYearManufactured,
    fuelType, setFuelType,
    transmission, setTransmission,
    color, setColor,
    engineCapacity, setEngineCapacity,
    makeMonth, setMakeMonth,
    registrationPlace, setRegistrationPlace,
    insuranceType, setInsuranceType,
    abs, setAbs,
    accidental, setAccidental,
    adjustableExternalMirror, setAdjustableExternalMirror,
    adjustableSteering, setAdjustableSteering,
    airConditioning, setAirConditioning,
    alloyWheels, setAlloyWheels,
    antiTheftDevice, setAntiTheftDevice,
    auxCompatibility, setAuxCompatibility,
    bluetooth, setBluetooth,
    certified, setCertified,
    cruiseControl, setCruiseControl,
    navigationSystem, setNavigationSystem,
    parkingSensors, setParkingSensors,
    powerSteering, setPowerSteering,
    rearParkingCamera, setRearParkingCamera,
    sunroof, setSunroof,
    usbCompatibility, setUsbCompatibility,
    exchange, setExchange,
    radio, setRadio,
    airbags, setAirbags,
    batteryCondition, setBatteryCondition,
    tyreCondition, setTyreCondition,
    lockSystem, setLockSystem,
    serviceHistory, setServiceHistory,
    powerWindows, setPowerWindows,
    isCar, isBike, isCommercial,
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        {isCar && <TabsTrigger value="features">Features</TabsTrigger>}
        {(isCar || isBike) && <TabsTrigger value="safety">Safety</TabsTrigger>}
        <TabsTrigger value="additional">Additional</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <VehicleBasicInfoTab {...vehicleStateProps} />
      </TabsContent>
      
      {isCar && (
        <TabsContent value="features">
          <VehicleFeaturesTab {...vehicleStateProps} />
        </TabsContent>
      )}
      
      {(isCar || isBike) && (
        <TabsContent value="safety">
          <VehicleSafetyTab {...vehicleStateProps} />
        </TabsContent>
      )}
      
      <TabsContent value="additional">
        <VehicleAdditionalTab {...vehicleStateProps} />
      </TabsContent>
    </Tabs>
  );
};

export default VehicleFields;
