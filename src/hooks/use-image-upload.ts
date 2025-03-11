
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useImageUpload(conversationId: string | undefined, sessionUserId: string | undefined, onImageUploaded?: (url: string) => void) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = async (file: File): Promise<void> => {
    if (!sessionUserId || !conversationId) return;
    
    try {
      setIsUploading(true);
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `chat_images/${conversationId}/${filename}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('chat_images')
        .getPublicUrl(filePath);
        
      if (onImageUploaded && urlData) {
        onImageUploaded(urlData.publicUrl);
      }
      
      toast({
        title: "Image uploaded",
        description: "Your image has been sent successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload image"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleUploadImage,
    isUploading
  };
}
