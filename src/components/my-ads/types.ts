
import { ProductCondition } from "@/types/categories";

export interface Listing {
  id: string;
  title: string;
  price: number;
  location: string | null;
  images: string[];
  condition: ProductCondition;
  status: string;
  view_count: number;
  save_count: number;
  featured: boolean;
  featured_requested: boolean;
  category: string;
  km_driven: number | null;
  year: number | null;
  subcategory: string;
}

export interface ListingGridProps {
  listings: Listing[];
  onMarkAsSold?: (id: string) => void;
  showSoldButton?: boolean;
  onListingDeleted?: () => void;
}

export interface ListingItemProps {
  listing: Listing;
  onMarkAsSold?: (id: string) => void;
  showSoldButton?: boolean;
  onListingDeleted?: () => void;
}
