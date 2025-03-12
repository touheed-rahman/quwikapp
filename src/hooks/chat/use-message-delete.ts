
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function useMessageDelete() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMessage = async (messageId: string) => {
    if (isDeleting) return false;
    
    setIsDeleting(true);
    try {
      console.log('Deleting message:', messageId);
      
      // Delete the message from the database
      const { error } = await supabase
        .from('messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId);
        
      if (error) {
        console.error('Error deleting message:', error);
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "There was an error deleting the message.",
        });
        return false;
      }
      
      toast({
        title: "Message deleted",
        description: "Your message has been removed.",
      });
      
      return true;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the message.",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteMessage
  };
}
