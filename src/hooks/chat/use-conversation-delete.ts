
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function useConversationDelete(
  userId: string | null,
  setConversations?: React.Dispatch<React.SetStateAction<any[]>>
) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (conversationId: string) => {
    try {
      if (isDeleting || !userId) return false;
      
      setIsDeleting(true);
      console.log('Deleting conversation:', conversationId);
      
      // Update the conversation record to mark it as deleted by this user
      const { error } = await supabase
        .from('conversations')
        .update({ 
          deleted_by: userId 
        })
        .eq('id', conversationId);
        
      if (error) {
        console.error('Error updating deleted_by:', error);
        throw error;
      }

      console.log('Successfully marked conversation as deleted');

      // If we have a state setter function, remove the deleted conversation 
      if (setConversations) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      }
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been removed from your chat list.",
      });
      
      // If we're currently viewing this conversation, redirect to home
      if (window.location.pathname.includes(`/chat/${conversationId}`)) {
        navigate('/');
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the conversation.",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDelete
  };
}
