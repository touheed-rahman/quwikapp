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

  // Update parent component when values change
  useEffect(() => {
    const formFields: Record<string, any> = {};
    
    // Convert kmDriven to a number and ensure it's passed correctly
    // This is the key fix - making sure km_driven is always a valid number
    formFields.km_driven = kmDriven ? parseInt(kmDriven, 10) : 0;
    
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
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="safety">Safety</TabsTrigger>
        <TabsTrigger value="additional">Additional</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <VehicleBasicInfoTab {...vehicleStateProps} />
      </TabsContent>
      
      <TabsContent value="features">
        <VehicleFeaturesTab {...vehicleStateProps} />
      </TabsContent>
      
      <TabsContent value="safety">
        <VehicleSafetyTab {...vehicleStateProps} />
      </TabsContent>
      
      <TabsContent value="additional">
        <VehicleAdditionalTab {...vehicleStateProps} />
      </TabsContent>
    </Tabs>
  );
};

export default VehicleFields;
