
export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_info?: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
}

export interface Conversation {
  id: string;
  listing_id: string;
  last_message: string;
  last_message_at: string;
  seller_id: string;
  buyer_id: string;
  listing: {
    title: string;
    price: number;
  };
  seller: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeller?: {
    id?: string;
    name: string;
    isVerified?: boolean;
    productInfo?: {
      title: string;
      price?: string;
    }
  };
}
