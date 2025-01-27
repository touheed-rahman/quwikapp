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
import { Upload } from "lucide-react";

const Sell = () => {
  const [images, setImages] = useState<FileList | null>(null);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">List Your Item</h1>
        
        <form className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input id="title" placeholder="Enter a descriptive title" />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="condition" className="text-sm font-medium">Condition</label>
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

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Price</label>
              <Input id="price" type="number" placeholder="Enter price" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <Textarea
              placeholder="Describe your item in detail"
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Images</h2>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="images"
                onChange={(e) => setImages(e.target.files)}
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Click to upload images (max 8)
                </span>
              </label>
              {images && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Array.from(images).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Input id="location" placeholder="Enter your location" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input id="phone" type="tel" placeholder="Enter your phone number" />
            </div>
          </div>

          <Button type="submit" className="w-full">
            List Item
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Sell;