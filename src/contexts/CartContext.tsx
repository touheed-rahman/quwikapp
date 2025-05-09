
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  listingId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  userId: string;
  sellerId: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  calculateTotal: () => number;
  calculateCommission: () => number;
  calculateNetTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Load cart items when user is authenticated
  useEffect(() => {
    const loadCartItems = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setCartItems(data || []);
      } catch (error) {
        console.error('Error loading cart items:', error);
        toast({
          title: "Error",
          description: "Failed to load your cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
    
    // Subscribe to cart changes
    const cartSubscription = supabase
      .channel('cart_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cart_items' 
      }, payload => {
        loadCartItems();
      })
      .subscribe();
      
    return () => {
      cartSubscription.unsubscribe();
    };
  }, [toast]);
  
  // Add item to cart
  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add items to cart",
          variant: "destructive",
        });
        return;
      }
      
      // Check if item already exists in cart
      const existingItem = cartItems.find(cartItem => cartItem.listingId === item.listingId);
      
      if (existingItem) {
        // Update quantity
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
        return;
      }
      
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ 
          ...item,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      
      setCartItems([...cartItems, data[0]]);
      toast({
        title: "Added to cart",
        description: "Item added to your cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };
  
  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
        
      if (error) throw error;
      
      setCartItems(cartItems.filter(item => item.id !== itemId));
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };
  
  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(itemId);
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);
        
      if (error) throw error;
      
      setCartItems(
        cartItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };
  
  // Clear entire cart
  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };
  
  // Calculate cart total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  // Calculate platform commission (10%)
  const calculateCommission = () => {
    return calculateTotal() * 0.1;
  };
  
  // Calculate net amount for seller
  const calculateNetTotal = () => {
    return calculateTotal() - calculateCommission();
  };
  
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isLoading,
      calculateTotal,
      calculateCommission,
      calculateNetTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
