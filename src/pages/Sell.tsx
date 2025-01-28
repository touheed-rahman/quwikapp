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
import { categories } from "@/types/categories";
import { Upload, X, ChevronRight, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

const Sell = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 12) {
      toast({
        title: "Maximum 12 images allowed",
        variant: "destructive",
      });
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">POST YOUR AD</h1>
        
        <form className="space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">CHOOSE A CATEGORY</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="w-full justify-between text-left h-12 px-4"
                >
                  <span>{category.name}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">INCLUDE SOME DETAILS</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Ad title *
                </label>
                <Input placeholder="Mention the key features of your item (e.g. brand, model, age, type)" />
                <p className="text-xs text-muted-foreground mt-1">0 / 70</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Description *
                </label>
                <Textarea 
                  placeholder="Include condition, features and reason for selling"
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-1">0 / 4096</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
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
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">SET A PRICE</h2>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                <Input className="pl-8" type="number" placeholder="Enter price" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">UPLOAD UP TO 12 PHOTOS</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {[...Array(12)].map((_, index) => {
                const preview = previewUrls[index];
                return (
                  <div
                    key={index}
                    className="aspect-square border-2 border-dashed rounded-lg relative overflow-hidden"
                  >
                    {preview ? (
                      <>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </>
                    ) : (
                      <label
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      >
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">
                          Add Photo
                        </span>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-destructive mt-2">This field is mandatory</p>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">CONFIRM YOUR LOCATION</h2>
            <div className="space-y-4">
              <div className="flex gap-4 border-b pb-2">
                <Button variant="ghost" className="flex-1 justify-start">
                  LIST
                </Button>
                <Button variant="ghost" className="flex-1 justify-start">
                  CURRENT LOCATION
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  State *
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ka">Karnataka</SelectItem>
                    <SelectItem value="mh">Maharashtra</SelectItem>
                    <SelectItem value="dl">Delhi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">REVIEW YOUR DETAILS</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src="https://via.placeholder.com/48"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Input defaultValue="John Doe" className="mb-2" />
                <Input defaultValue="+91 9876543210" />
              </div>
            </div>
          </Card>

          <Button type="submit" className="w-full" size="lg">
            Post now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Sell;