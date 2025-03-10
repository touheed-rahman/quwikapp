
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleFeaturesTabProps {
  airConditioning: boolean;
  setAirConditioning: (value: boolean) => void;
  powerSteering: boolean;
  setPowerSteering: (value: boolean) => void;
  adjustableSteering: boolean;
  setAdjustableSteering: (value: boolean) => void;
  cruiseControl: boolean;
  setCruiseControl: (value: boolean) => void;
  sunroof: boolean;
  setSunroof: (value: boolean) => void;
  adjustableExternalMirror: boolean;
  setAdjustableExternalMirror: (value: boolean) => void;
  powerWindows: string;
  setPowerWindows: (value: string) => void;
  bluetooth: boolean;
  setBluetooth: (value: boolean) => void;
  auxCompatibility: boolean;
  setAuxCompatibility: (value: boolean) => void;
  usbCompatibility: boolean;
  setUsbCompatibility: (value: boolean) => void;
  radio: boolean;
  setRadio: (value: boolean) => void;
  navigationSystem: boolean;
  setNavigationSystem: (value: boolean) => void;
  alloyWheels: boolean;
  setAlloyWheels: (value: boolean) => void;
}

const VehicleFeaturesTab = ({
  airConditioning,
  setAirConditioning,
  powerSteering,
  setPowerSteering,
  adjustableSteering,
  setAdjustableSteering,
  cruiseControl,
  setCruiseControl,
  sunroof,
  setSunroof,
  adjustableExternalMirror,
  setAdjustableExternalMirror,
  powerWindows,
  setPowerWindows,
  bluetooth,
  setBluetooth,
  auxCompatibility,
  setAuxCompatibility,
  usbCompatibility,
  setUsbCompatibility,
  radio,
  setRadio,
  navigationSystem,
  setNavigationSystem,
  alloyWheels,
  setAlloyWheels
}: VehicleFeaturesTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default VehicleFeaturesTab;
