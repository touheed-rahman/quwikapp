import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

export const CartButton = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate('/cart')}
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {cartItems.length > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white rounded-full text-xs"
        >
          {cartItems.length}
        </Badge>
      )}
    </Button>
  );
};
