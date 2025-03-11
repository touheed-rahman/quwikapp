
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface SellerInfoProps {
  seller: {
    id: string;
    full_name: string;
    created_at: string;
    avatar_url?: string;
  };
  onChatClick: () => void;
  onMakeOffer: () => void;
}

const SellerInfo = ({ seller, onChatClick, onMakeOffer }: SellerInfoProps) => {
  const sellerName = seller.full_name || 'Anonymous';
  const memberYear = new Date(seller.created_at).getFullYear();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
          {seller.avatar_url ? (
            <img
              src={seller.avatar_url}
              alt={sellerName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                e.currentTarget.parentElement!.innerHTML += `<span class="text-lg font-semibold text-primary">${sellerName[0]?.toUpperCase() || 'A'}</span>`;
              }}
            />
          ) : (
            <span className="text-lg font-semibold text-primary">
              {sellerName[0]?.toUpperCase() || 'A'}
            </span>
          )}
        </div>
        <div>
          <Link 
            to={`/seller/${seller.id}`}
            className="font-semibold hover:text-primary transition-colors"
          >
            {sellerName}
          </Link>
          <p className="text-sm text-muted-foreground">
            Member since {memberYear}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button 
          className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground"
          onClick={onChatClick}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Chat with Seller
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-12 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={onMakeOffer}
        >
          <Tag className="h-5 w-5 mr-2" />
          Make Offer
        </Button>
      </div>
    </Card>
  );
};

export default SellerInfo;
