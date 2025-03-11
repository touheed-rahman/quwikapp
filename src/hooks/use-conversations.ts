
import { useState, useEffect, useCallback } from 'react';
import { useConversationFetch } from './chat/use-conversation-fetch';
import { useConversationDelete } from './chat/use-conversation-delete';
import { useConversationFilters } from './chat/use-conversation-filters';
import { useConversationSubscriptions } from './chat/use-conversation-subscriptions';

export function useConversations(
  filter: 'all' | 'buying' | 'selling',
  userId: string | null,
  isAuthenticated: boolean | null
) {
  const {
    conversations,
    setConversations,
    isLoading,
    unreadCounts,
    fetchConversations
  } = useConversationFetch(filter, userId);

  const { isDeleting, handleDelete } = useConversationDelete(userId, setConversations);
  
  const { filterUnreadCounts, filterConversations } = useConversationFilters(
    conversations,
    unreadCounts,
    userId
  );

  // Initialize conversations when component mounts or filter/auth changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchConversations();
    }
  }, [filter, isAuthenticated, userId, fetchConversations]);

  // Set up real-time subscriptions
  useConversationSubscriptions(userId, fetchConversations);

  // Force a refresh of conversations
  const refreshConversations = useCallback(() => {
    if (isAuthenticated && userId) {
      console.log('Manually refreshing conversations');
      fetchConversations();
    }
  }, [isAuthenticated, userId, fetchConversations]);

  return {
    conversations,
    isLoading,
    unreadCounts,
    handleDelete,
    fetchConversations,
    refreshConversations,
    isDeleting,
    filterUnreadCounts,
    filterConversations
  };
}
