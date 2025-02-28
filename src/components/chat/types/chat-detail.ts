
export interface ConversationDetails {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
}
