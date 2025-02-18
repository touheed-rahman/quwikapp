
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  status?: string;
  deleted_at?: string | null;
}

export interface ConversationDetails {
  id: string;  // Added this property
  seller: {
    id: string;
    full_name: string;
  };
  buyer: {
    id: string;
    full_name: string;
  };
  listing: Listing;
}
