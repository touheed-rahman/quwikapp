
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useListingForm = () => {
  const [formData, setFormData] = useState<any>({
    specs: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Make formData accessible globally for the km_driven field
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

    // Validate km_driven for vehicles
    if (formData.category === 'vehicles' && (!formData.km_driven && formData.km_driven !== 0)) {
      toast({
        title: "Missing Kilometers Driven",
        description: "Please enter the kilometers driven",
        variant: "destructive"
      });
      return false;
    }
    
    // Validate brand for vehicles and electronics
    if ((formData.category === 'vehicles' || formData.category === 'electronics') && !formData.brand) {
      toast({
        title: "Missing Brand",
        description: "Please enter the brand name",
        variant: "destructive"
      });
      return false;
    }
    
    // Validate year for vehicles
    if (formData.category === 'vehicles' && (!formData.specs?.year)) {
      toast({
        title: "Missing Year",
        description: "Please select the year of manufacture",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, selectedLocation: string | null) => {
    e.preventDefault();
    
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
        km_driven: formData.category === 'vehicles' ? formData.km_driven : null,
        brand: formData.brand || null,
        specs: formData.specs || {}
      };

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
