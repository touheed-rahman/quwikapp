
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShoppingBag, ChevronLeft, Download, Package, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define an Order type for TypeScript
interface Order {
  id: string;
  listing_id: string;
  user_id: string;
  seller_id: string;
  quantity: number;
  price: number;
  status: string;
  commission_rate: number;
  commission_amount: number;
  net_amount: number;
  created_at: string;
  updated_at: string;
  listing?: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

// Order status steps
const ORDER_STATUSES = {
  created: { label: "Order Created", color: "bg-blue-600", icon: ShoppingBag },
  inspection: { label: "Item Inspection", color: "bg-yellow-600", icon: Package },
  verified: { label: "Verification Passed", color: "bg-green-600", icon: CheckCircle },
  shipped: { label: "Shipped", color: "bg-purple-600", icon: Package },
  delivered: { label: "Delivered", color: "bg-green-600", icon: CheckCircle },
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      } else {
        navigate('/profile');
      }
    };
    getUserId();
  }, [navigate]);

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", userId, activeTab],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, listing:listings(id, title, price, images)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Order[];
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  if (error) {
    toast({
      title: "Error loading orders",
      description: "Failed to load your orders. Please try again.",
      variant: "destructive",
    });
  }

  const renderOrderStatus = (status: string) => {
    const orderStatus = ORDER_STATUSES[status as keyof typeof ORDER_STATUSES];
    if (!orderStatus) return null;
    
    const StatusIcon = orderStatus.icon;
    
    return (
      <Badge className={`${orderStatus.color} flex items-center gap-1`}>
        <StatusIcon className="h-3.5 w-3.5 mr-1" />
        {orderStatus.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 p-2" 
            onClick={() => navigate('/profile')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : orders && orders.length > 0 ? (
              <>
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" /> 
                            Order #{order.id.substring(0, 8)}
                          </CardTitle>
                          <CardDescription>
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {renderOrderStatus(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {order.listing && (
                        <div className="flex gap-3">
                          <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${order.listing.images?.[0] || ""}`} 
                              alt={order.listing.title} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{order.listing.title}</h3>
                            <div className="flex justify-between mt-1">
                              <p className="text-sm text-muted-foreground">
                                Quantity: {order.quantity}
                              </p>
                              <p className="font-medium">
                                ₹{order.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>₹{(order.price * order.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Platform fee (10%):</span>
                          <span>₹{order.commission_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>₹{(order.price * order.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Order ID: {order.id}
                      </span>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="h-4 w-4" /> Invoice
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No orders found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet
                </p>
                <Button onClick={() => navigate('/')}>
                  Browse Products
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
