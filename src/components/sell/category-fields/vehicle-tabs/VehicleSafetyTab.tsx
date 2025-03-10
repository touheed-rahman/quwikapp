
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleSafetyTabProps {
  airbags: string;
  setAirbags: (value: string) => void;
  abs: boolean;
  setAbs: (value: boolean) => void;
  antiTheftDevice: boolean;
  setAntiTheftDevice: (value: boolean) => void;
  parkingSensors: boolean;
  setParkingSensors: (value: boolean) => void;
  rearParkingCamera: boolean;
  setRearParkingCamera: (value: boolean) => void;
  lockSystem: string;
  setLockSystem: (value: string) => void;
}

const VehicleSafetyTab = ({
  airbags,
  setAirbags,
  abs,
  setAbs,
  antiTheftDevice,
  setAntiTheftDevice,
  parkingSensors,
  setParkingSensors,
  rearParkingCamera,
  setRearParkingCamera,
  lockSystem,
  setLockSystem
}: VehicleSafetyTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default VehicleSafetyTab;
