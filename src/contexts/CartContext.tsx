
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
        
        // Using raw SQL query to get cart items since the cart_items table 
        // might not be directly accessible via the schema types
        const { data, error } = await supabase.rpc('get_cart_items', {
          user_id_param: user.id
        });
          
        if (error) throw error;
        
        // Transform data to match CartItem interface
        const formattedItems: CartItem[] = data ? data.map((item: any) => ({
          id: item.id,
          listingId: item.listing_id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          userId: item.user_id,
          sellerId: item.seller_id
        })) : [];
        
        setCartItems(formattedItems);
      } catch (error) {
        console.error('Error loading cart items:', error);
        // If RPC function isn't available, fallback to empty cart
        setCartItems([]);
        toast({
          title: "Notice",
          description: "Unable to load cart items. The cart functionality may not be fully set up yet.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
    
    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        loadCartItems();
      }
    });
      
    return () => {
      authListener.subscription.unsubscribe();
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
      
      // Add new item using raw SQL
      const { data, error } = await supabase.rpc('add_cart_item', {
        listing_id_param: item.listingId,
        title_param: item.title,
        price_param: item.price,
        image_param: item.image,
        quantity_param: item.quantity,
        seller_id_param: item.sellerId
      });
        
      if (error) throw error;
      
      if (data) {
        const newItem: CartItem = {
          id: data.id,
          listingId: item.listingId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          userId: user.id,
          sellerId: item.sellerId
        };
        
        setCartItems([...cartItems, newItem]);
        
        toast({
          title: "Added to cart",
          description: "Item added to your cart",
        });
      }
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
      const { error } = await supabase.rpc('remove_cart_item', {
        item_id_param: itemId
      });
        
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
      const { error } = await supabase.rpc('update_cart_item_quantity', {
        item_id_param: itemId,
        quantity_param: quantity
      });
        
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
      
      const { error } = await supabase.rpc('clear_cart', {
        user_id_param: user.id
      });
        
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
