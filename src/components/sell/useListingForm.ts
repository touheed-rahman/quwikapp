
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useListingForm = () => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Make formData accessible globally for the form fields
  if (typeof window !== 'undefined') {
    window.formDataRef = formData;
  }

  const validateForm = (selectedLocation: string | null) => {
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title for your listing",
        variant: "destructive"
      });
      return false;
    }
    
    if (!description.trim()) {
      toast({
        title: "Missing Description",
        description: "Please enter a description for your listing",
        variant: "destructive"
      });
      return false;
    }
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return false;
    }
    
    if (!condition) {
      toast({
        title: "Missing Condition",
        description: "Please select the condition of your item",
        variant: "destructive"
      });
      return false;
    }
    
    if (!selectedLocation) {
      toast({
        title: "Missing Location",
        description: "Please select your location",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.images || formData.images.length === 0) {
      toast({
        title: "Missing Images",
        description: "Please upload at least one image",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.category || !formData.subcategory) {
      toast({
        title: "Missing Category",
        description: "Please select a category and subcategory",
        variant: "destructive"
      });
      return false;
    }

    // Category-specific validations
    if (formData.category === 'vehicles') {
      // Look for km_driven first in the specs if available (coming from updated input fields)
      // then fallback to root level km_driven
      
      // First check for valid values at the root level
      let kmDriven = 0;
      
      if (typeof formData.km_driven === 'number' && !isNaN(formData.km_driven) && formData.km_driven > 0) {
        kmDriven = formData.km_driven;
      } else if (typeof formData.km_driven === 'string' && formData.km_driven.trim() !== '') {
        kmDriven = parseInt(formData.km_driven, 10);
      }
      
      // Log what we found for debugging
      console.log("km_driven for validation:", kmDriven);
      
      // Must be greater than 0
      if (kmDriven <= 0 || isNaN(kmDriven)) {
        toast({
          title: "Missing Kilometers Driven",
          description: "Please enter a valid number for kilometers driven",
          variant: "destructive"
        });
        console.error("km_driven validation failed:", formData.km_driven);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, selectedLocation: string | null) => {
    e.preventDefault();
    
    // Log the form data for debugging
    console.log("Form data before submission:", formData);
    
    if (!validateForm(selectedLocation)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to post an ad",
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }

      const imageUploadPromises = formData.images.map(async (image: File) => {
        const filename = `${crypto.randomUUID()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filename, image);

        if (uploadError) throw uploadError;
        return filename;
      });

      const uploadedImagePaths = await Promise.all(imageUploadPromises);

      // Ensure km_driven is a number for vehicle listings
      let kmDriven = null;
      if (formData.category === 'vehicles') {
        if (typeof formData.km_driven === 'number' && !isNaN(formData.km_driven) && formData.km_driven > 0) {
          kmDriven = formData.km_driven;
        } else if (formData.km_driven !== undefined && formData.km_driven !== null) {
          // Convert to number and ensure it's valid
          kmDriven = Number(formData.km_driven);
          if (isNaN(kmDriven) || kmDriven <= 0) kmDriven = 1; // Default to 1 if invalid
        } else {
          kmDriven = 1; // Default to 1 if not provided
        }
      }

      // Prepare the listing data with all the fields
      const listingData = {
        title,
        description,
        price: parseFloat(price),
        category: formData.category,
        subcategory: formData.subcategory,
        condition,
        location: selectedLocation,
        images: uploadedImagePaths,
        user_id: user.id,
        status: 'pending',
        // Include specs and other category-specific fields
        km_driven: kmDriven,
        brand: formData.brand || null,
        specs: formData.specs || null
      };

      console.log('Submitting listing data:', listingData);

      const { error } = await supabase.from('listings').insert(listingData);

      if (error) throw error;

      toast({
        title: "Ad Posted Successfully!",
        description: "Your ad will be visible after review.",
      });

      setTimeout(() => navigate('/'), 1000);

    } catch (error) {
      console.error('Error posting ad:', error);
      toast({
        title: "Error",
        description: "Failed to post your ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    condition,
    setCondition,
    handleSubmit
  };
};
