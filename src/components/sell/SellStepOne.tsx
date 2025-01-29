import { useState } from "react";
import { Button } from "../ui/button";
import { categories } from "@/types/categories";
import { Upload, X } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface SellStepOneProps {
  onNext: (data: { category: string; subcategory: string; images: File[] }) => void;
}

const SellStepOne = ({ onNext }: SellStepOneProps) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
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

  const handleNext = () => {
    if (!selectedCategory || !selectedSubcategory) {
      toast({
        title: "Please select a category and subcategory",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    onNext({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      images,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="h-24 flex-col gap-2"
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedSubcategory("");
            }}
          >
            <span className="text-sm font-medium">{category.name}</span>
          </Button>
        ))}
      </div>

      {selectedCategory && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Select Subcategory</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories
              .find((c) => c.id === selectedCategory)
              ?.subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  variant={selectedSubcategory === sub.id ? "default" : "outline"}
                  onClick={() => setSelectedSubcategory(sub.id)}
                >
                  {sub.name}
                </Button>
              ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upload Images</h3>
        <div className="grid grid-cols-3 gap-4">
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
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
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
      </div>

      <Button onClick={handleNext} className="w-full" size="lg">
        Next
      </Button>
    </div>
  );
};

export default SellStepOne;