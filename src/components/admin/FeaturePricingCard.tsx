
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function FeaturePricingCard() {
  const [category, setCategory] = useState("default");
  const [subcategory, setSubcategory] = useState("");
  const [featureType, setFeatureType] = useState("homepage");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Sample categories for the dropdown
  const categories = [
    { value: "default", label: "Default (All Categories)" },
    { value: "vehicles", label: "Vehicles" },
    { value: "electronics", label: "Electronics" },
    { value: "furniture", label: "Furniture" },
    { value: "fashion", label: "Fashion" },
    { value: "property", label: "Property" },
  ];

  // Feature types
  const featureTypes = [
    { value: "homepage", label: "Homepage Feature" },
    { value: "productPage", label: "Category Page Feature" },
    { value: "both", label: "Premium Feature (Both)" },
  ];

  const handlePricingUpdate = async () => {
    if (!price || !originalPrice) {
      toast({
        title: "Missing information",
        description: "Please enter all required pricing information",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if pricing exists for this category/subcategory/feature type
      const { data: existingPricing, error: fetchError } = await supabase
        .from('feature_pricing')
        .select('id')
        .eq('category', category)
        .eq('subcategory', subcategory || null)
        .eq('feature_type', featureType)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingPricing) {
        // Update existing pricing
        const { error: updateError } = await supabase
          .from('feature_pricing')
          .update({
            price: parseFloat(price),
            original_price: parseFloat(originalPrice),
            updated_at: new Date()
          })
          .eq('id', existingPricing.id);

        if (updateError) throw updateError;
      } else {
        // Insert new pricing
        const { error: insertError } = await supabase
          .from('feature_pricing')
          .insert({
            category,
            subcategory: subcategory || null,
            feature_type: featureType,
            price: parseFloat(price),
            original_price: parseFloat(originalPrice)
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Price updated",
        description: "Feature pricing has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating pricing:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update pricing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCategory("default");
    setSubcategory("");
    setFeatureType("homepage");
    setPrice("");
    setOriginalPrice("");
  };

  const loadCurrentPricing = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc(
        'get_feature_price',
        {
          category_name: category,
          subcategory_name: subcategory || null,
          feature_type_name: featureType
        }
      );

      if (error) throw error;
      
      if (data) {
        setPrice(data.price?.toString() || "");
        setOriginalPrice(data.original_price?.toString() || "");
      }
    } catch (error: any) {
      console.error("Error loading pricing:", error);
      toast({
        title: "Error",
        description: "Failed to load current pricing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Pricing Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setSubcategory("");
            }}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory (Optional)</Label>
          <Input
            id="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            placeholder="Enter subcategory or leave blank for all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="featureType">Feature Type</Label>
          <Select value={featureType} onValueChange={setFeatureType}>
            <SelectTrigger id="featureType">
              <SelectValue placeholder="Select Feature Type" />
            </SelectTrigger>
            <SelectContent>
              {featureTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Sale Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price</Label>
          <Input
            id="originalPrice"
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter original price"
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={loadCurrentPricing}
            disabled={isLoading}
          >
            Load Current Price
          </Button>
          <Button 
            variant="outline" 
            onClick={resetForm}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button 
            onClick={handlePricingUpdate}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Price"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
