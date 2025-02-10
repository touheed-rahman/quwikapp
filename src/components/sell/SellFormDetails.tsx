
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";

interface SellFormDetailsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SellFormDetails = ({
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  condition,
  setCondition,
  location,
  setLocation,
  isSubmitting,
  onBack,
  onSubmit
}: SellFormDetailsProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-6">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Ad title *
          </label>
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
            required 
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Description *
          </label>
          <Textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Include condition, features and reason for selling"
            className="min-h-[120px] resize-none"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Condition *
          </label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Price *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="pl-8" 
              placeholder="Enter price"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Location *
          </label>
          <LocationSelector value={location} onChange={setLocation} />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-primary hover:bg-primary/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Posting Ad...
            </div>
          ) : (
            'Post Ad'
          )}
        </Button>
      </div>
    </form>
  );
};

export default SellFormDetails;
