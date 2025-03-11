
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShoppingBag, ChevronLeft, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define an Order type for TypeScript
interface Order {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  payment_status: string;
  invoice_number: string;
  created_at: string;
  updated_at: string;
  order_type: string;
  feature_plan?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_address?: string;
  invoice_url?: string;
  listing?: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

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
      }
    };
    getUserId();
  }, []);

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", userId, activeTab],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        // Use fetch API directly to avoid TypeScript issues with Supabase client
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cgrtrdwvkkhraizqukwt.supabase.co'}/rest/v1/orders`;
        const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncnRyZHd2a2tocmFpenF1a3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjE2NTIsImV4cCI6MjA1MzYzNzY1Mn0.mnC-NB_broDr4nOHggi0ngeDC1CxZsda6X-wyEMD2tE';
        
        let query = `?buyer_id=eq.${userId}&select=*,listing:listings(id,title,price,images)`;
        
        if (activeTab === 'features') {
          query += `&order_type=eq.feature`;
        } else if (activeTab === 'purchases') {
          query += `&order_type=eq.purchase`;
        }
        
        query += `&order=created_at.desc`;
        
        const response = await fetch(`${url}${query}`, {
          headers: {
            'apikey': apiKey,
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
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

  const handleDownloadInvoice = (order: Order) => {
    if (order.invoice_url) {
      window.open(order.invoice_url, '_blank');
    } else {
      toast({
        title: "Invoice not available",
        description: "The invoice is not available for download yet.",
        variant: "default",
      });
    }
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
            <TabsTrigger value="features">Featured Listings</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
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
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" /> 
                            {order.order_type === 'feature' 
                              ? 'Featured Listing' 
                              : 'Purchase'
                            }
                          </CardTitle>
                          <CardDescription>
                            Invoice #{order.invoice_number}
                          </CardDescription>
                        </div>
                        <Badge variant={order.payment_status === 'completed' ? 'default' : 'outline'} className={order.payment_status === 'completed' ? 'bg-green-600' : ''}>
                          {order.payment_status === 'completed' ? 'Paid' : 'Pending'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {order.listing && (
                        <div className="flex gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                            <img 
                              src={order.listing.images?.[0] || "/placeholder.svg"} 
                              alt={order.listing.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{order.listing.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.order_type === 'feature' 
                                ? `Feature Plan: ${order.feature_plan}` 
                                : `Price: ₹${order.listing.price}`
                              }
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {order.order_type === 'feature' && (
                        <div className="mt-3 space-y-1 text-sm">
                          <p><span className="font-medium">Contact:</span> {order.contact_name}</p>
                          <p><span className="font-medium">Phone:</span> {order.contact_phone}</p>
                          <p><span className="font-medium">Address:</span> {order.contact_address}</p>
                        </div>
                      )}
                      
                      {order.payment_status === 'completed' && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleDownloadInvoice(order)}
                          >
                            <Download className="h-4 w-4" /> Download Invoice
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 text-sm text-muted-foreground">
                      <span>Ordered on {new Date(order.created_at).toLocaleDateString()}</span>
                    </CardFooter>
                  </Card>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No orders found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'features' 
                    ? "You haven't featured any listings yet" 
                    : activeTab === 'purchases' 
                      ? "You haven't made any purchases yet"
                      : "You don't have any orders yet"
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
