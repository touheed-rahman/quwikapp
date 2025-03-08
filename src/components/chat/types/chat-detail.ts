
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_system_message?: boolean;
  is_block_message?: boolean;
  is_report?: boolean;
  reported_message_id?: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  status?: string;
  deleted_at?: string | null;
}

export interface ConversationDetails {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
  seller?: {
    id: string;
    full_name: string;
  };
  buyer?: {
    id: string;
    full_name: string;
  };
  listing?: Listing;
}
