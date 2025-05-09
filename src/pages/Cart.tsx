
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Cart = () => {
  const { 
    cartItems, 
    isLoading, 
    calculateTotal, 
    calculateCommission, 
    clearCart 
  } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCheckout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to checkout",
          variant: "destructive",
        });
        navigate('/profile');
        return;
      }
      
      if (cartItems.length === 0) {
        toast({
          title: "Empty cart",
          description: "Your cart is empty",
          variant: "destructive",
        });
        return;
      }
      
      // Create order records
      const orderItems = cartItems.map(item => ({
        user_id: user.id,
        listing_id: item.listingId,
        seller_id: item.sellerId,
        quantity: item.quantity,
        price: item.price,
        status: 'created',
        commission_rate: 0.1,
        commission_amount: item.price * item.quantity * 0.1,
        net_amount: item.price * item.quantity * 0.9
      }));
      
      const { data: orders, error } = await supabase
        .from('orders')
        .insert(orderItems)
        .select();
        
      if (error) throw error;
      
      // Clear the cart
      await clearCart();
      
      toast({
        title: "Order placed successfully",
        description: "You can track your order in My Orders",
      });
      
      navigate('/my-orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-60 w-full max-w-md bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            className="text-2xl font-bold mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Your Cart
          </motion.h1>
          
          {cartItems.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Browse our marketplace to find items you love
              </p>
              <Button onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 mb-6">
                <div className="space-y-1">
                  {cartItems.map(item => (
                    <CartItem 
                      key={item.id}
                      id={item.id}
                      listingId={item.listingId}
                      title={item.title}
                      price={item.price}
                      image={item.image}
                      quantity={item.quantity}
                      userId={item.userId}
                      sellerId={item.sellerId}
                    />
                  ))}
                </div>
              </Card>
              
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  All items are subject to verification. If an item does not match the description, you can request a return.
                </AlertDescription>
              </Alert>
              
              <Card className="p-6">
                <h3 className="font-medium mb-4">Order Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform fee (10%)</span>
                    <span>{formatPrice(calculateCommission())}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                
                <div className="mt-6 space-y-4">
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
