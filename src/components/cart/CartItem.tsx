
import React from 'react';
import { Trash, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  id: string;
  listingId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  userId: string;
  sellerId: string;
}

const CartItem = ({
  id,
  listingId,
  title,
  price,
  image,
  quantity,
  userId,
  sellerId
}: CartItemProps) => {
  const { removeFromCart, updateQuantity } = useCart();
  
  const handleRemove = () => {
    removeFromCart(id);
  };
  
  const handleIncreaseQuantity = () => {
    updateQuantity(id, quantity + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    } else {
      removeFromCart(id);
    }
  };
  
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        <img 
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${image}`} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={e => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{title}</h4>
        <p className="text-primary font-semibold mt-1">{formatPrice(price)}</p>
      </div>
      
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={handleDecreaseQuantity}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="mx-2 min-w-[2rem] text-center">{quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={handleIncreaseQuantity}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={handleRemove}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
