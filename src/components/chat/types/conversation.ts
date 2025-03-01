
export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export interface ListingDetails {
  id: string;
  title: string;
  price: number;
}

export interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  last_message?: string;
  last_message_at?: string;
  listing: ListingDetails;
  seller: Profile;
  buyer: Profile;
  deleted?: boolean;
}
