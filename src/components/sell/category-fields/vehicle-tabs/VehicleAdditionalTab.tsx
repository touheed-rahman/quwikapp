
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleAdditionalTabProps {
  accidental: boolean;
  setAccidental: (value: boolean) => void;
  certified: boolean;
  setCertified: (value: boolean) => void;
  serviceHistory: string;
  setServiceHistory: (value: string) => void;
  batteryCondition: string;
  setBatteryCondition: (value: string) => void;
  tyreCondition: string;
  setTyreCondition: (value: string) => void;
  exchange: boolean;
  setExchange: (value: boolean) => void;
  isCar?: boolean;
  isBike?: boolean;
  isCommercial?: boolean;
}

const VehicleAdditionalTab = ({
  accidental,
  setAccidental,
  certified,
  setCertified,
  serviceHistory,
  setServiceHistory,
  batteryCondition,
  setBatteryCondition,
  tyreCondition,
  setTyreCondition,
  exchange,
  setExchange,
  isCar = false,
  isBike = false,
  isCommercial = false
}: VehicleAdditionalTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default VehicleAdditionalTab;
