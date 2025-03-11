
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const getFirstImageUrl = (images: string[]) => {
  if (images && images.length > 0) {
    return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
  }
  return "https://via.placeholder.com/300";
};

export const handleDelete = async (
  listingId: string,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('listings')
      .update({ 
        deleted_at: now,
        status: 'deleted'
      })
      .eq('id', listingId);

    if (error) throw error;
    
    toast({
      title: "Listing deleted",
      description: "Your listing has been successfully deleted."
    });
    
    onSuccess();
  } catch (error) {
    console.error('Error deleting listing:', error);
    toast({
      title: "Error",
      description: "Failed to delete listing. Please try again.",
      variant: "destructive"
    });
    onError(error);
  }
};
