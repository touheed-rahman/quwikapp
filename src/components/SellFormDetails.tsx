
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  category?: string;
}

const showConditionFor = ['electronics', 'vehicles', 'furniture', 'fashion', 'sports', 'books'];

const SellFormDetails = forwardRef<HTMLFormElement, SellFormDetailsProps>(({
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
  onSubmit,
  category
}, ref) => {
  const shouldShowCondition = category && showConditionFor.includes(category.toLowerCase());

  return (
    <form ref={ref} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item in detail"
            required
            className="min-h-[120px]"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price (₹) *
          </label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price in rupees"
            required
            min="0"
            step="0.01"
          />
        </div>

        {shouldShowCondition && (
          <div>
            <label htmlFor="condition" className="block text-sm font-medium mb-2">
              Condition *
            </label>
            <Select value={condition} onValueChange={setCondition} required>
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
        )}

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location *
          </label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Posting..." : "Post Ad"}
        </Button>
      </div>
    </form>
  );
});

SellFormDetails.displayName = "SellFormDetails";

export default SellFormDetails;
