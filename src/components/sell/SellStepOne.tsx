
import { useState, useCallback } from "react";
import CategorySelector from "./CategorySelector";
import SubcategorySelector from "./SubcategorySelector";
import ImageUpload from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronRight, FileImage } from "lucide-react";

interface SellStepOneProps {
  onNext: (data: any) => void;
}

const SellStepOne = ({ onNext }: SellStepOneProps) => {
  const [category, setCategory] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = useCallback(() => {
    if (!category) {
      setError("Please select a category");
      return;
    }

    if (!subcategory) {
      setError("Please select a subcategory");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    setError(null);
    onNext({
      category,
      subcategory,
      images,
    });
  }, [category, subcategory, images, onNext]);

  return (
    <div className="container mx-auto px-4 py-2 w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex items-center justify-center"
      >
        <div className="bg-primary/10 rounded-full px-4 py-2 inline-flex items-center">
          <FileImage className="w-5 h-5 mr-2 text-primary" />
          <span className="font-medium text-primary">Step 1: Category & Images</span>
        </div>
      </motion.div>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="bg-white rounded-lg shadow-md border-primary/10 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/10">
            <h3 className="font-medium text-lg text-primary/90">Select Category</h3>
          </div>
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <CategorySelector 
                  value={category} 
                  onChange={(val) => {
                    setCategory(val);
                    setSubcategory(null);
                  }}
                />
              </div>
              <div className="space-y-2">
                <SubcategorySelector 
                  category={category} 
                  value={subcategory} 
                  onChange={setSubcategory}
                  disabled={!category}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow-md border-primary/10 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/10">
            <h3 className="font-medium text-lg text-primary/90">Add Images</h3>
          </div>
          <div className="p-5">
            <ImageUpload images={images} setImages={setImages} />
          </div>
        </Card>
        
        {error && (
          <div className="text-destructive text-sm font-medium px-4 py-2 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleContinue}
            className="px-8"
            size="lg"
            disabled={!category || !subcategory || images.length === 0}
          >
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellStepOne;
