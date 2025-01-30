import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import SellStepOne from "@/components/sell/SellStepOne";
import Header from "@/components/Header";

const Sell = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const handleStepOneComplete = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ad posted successfully!",
      description: "Your ad will be visible after review.",
    });
  };

  if (step === 1) {
    return <SellStepOne onNext={handleStepOneComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-6">ITEM DETAILS</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Ad title *
              </label>
              <Input placeholder="Mention the key features of your item (e.g. brand, model, age, type)" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description *
              </label>
              <Textarea 
                placeholder="Include condition, features and reason for selling"
                className="min-h-[120px] resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Condition *
              </label>
              <Select>
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
                <Input className="pl-8" type="number" placeholder="Enter price" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Location *
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Post Ad
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sell;