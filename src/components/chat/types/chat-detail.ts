
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export interface ConversationDetails {
  seller: {
    id: string;
    full_name: string;
  };
  buyer: {
    id: string;
    full_name: string;
  };
  listing: {
    title: string;
    price: number;
  };
}

