
import { Conversation } from '@/components/chat/types/conversation';

export function useConversationFilters(
  conversations: Conversation[],
  unreadCounts: Record<string, number>,
  userId: string | null
) {
  // Calculate unread counts by category
  const filterUnreadCounts = {
    all: Object.values(unreadCounts).reduce((sum, count) => sum + count, 0),
    buying: conversations
      .filter(c => userId === c.buyer_id)
      .reduce((sum, conv) => sum + (unreadCounts[conv.id] || 0), 0),
    selling: conversations
      .filter(c => userId === c.seller_id)
      .reduce((sum, conv) => sum + (unreadCounts[conv.id] || 0), 0)
  };

  // Filter conversations based on search term
  const filterConversations = (searchTerm: string) => {
    if (!searchTerm.trim()) return conversations;
    
    return conversations.filter(conv => 
      conv.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.buyer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.last_message && conv.last_message.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return {
    filterUnreadCounts,
    filterConversations
  };
}
