
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  created_at: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  buyer: {
    full_name: string;
  };
  items: {
    id: string;
    title: string;
    quantity: number;
    price: number;
  }[];
}

const SellerOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Mock data for now
    setOrders([
      {
        id: 'ORD-001',
        created_at: new Date().toISOString(),
        status: 'pending',
        total_amount: 1299,
        buyer: {
          full_name: 'Rahul Sharma'
        },
        items: [
          {
            id: 'ITEM-1',
            title: 'Wireless Bluetooth Earbuds',
            quantity: 1,
            price: 1299
          }
        ]
      },
      {
        id: 'ORD-002',
        created_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
        status: 'processing',
        total_amount: 2499,
        buyer: {
          full_name: 'Priya Patel'
        },
        items: [
          {
            id: 'ITEM-2',
            title: 'Smart Watch Series 5',
            quantity: 1,
            price: 2499
          }
        ]
      },
      {
        id: 'ORD-003',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: 'shipped',
        total_amount: 1099,
        buyer: {
          full_name: 'Amit Kumar'
        },
        items: [
          {
            id: 'ITEM-3',
            title: 'Phone Case Protective Cover',
            quantity: 1,
            price: 599
          },
          {
            id: 'ITEM-4',
            title: 'Screen Protector Glass',
            quantity: 1,
            price: 500
          }
        ]
      }
    ]);
    setIsLoading(false);
  }, []);

  // In a real implementation, we would fetch orders from Supabase
  // This would look something like:
  // 
  // const fetchOrders = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (!user) return;
  // 
  //     const { data, error } = await supabase
  //       .from('orders')
  //       .select(`
  //         id, created_at, status, total_amount, 
  //         profiles!buyer_id(full_name), 
  //         order_items(id, quantity, price, listings(title))
  //       `)
  //       .eq('seller_id', user.id)
  //       .order('created_at', { ascending: false });
  // 
  //     if (error) throw error;
  //     
  //     // Transform data to match Order interface
  //     const transformedData = data.map(order => ({
  //       ...order,
  //       buyer: order.profiles,
  //       items: order.order_items.map(item => ({
  //         id: item.id,
  //         title: item.listings.title,
  //         quantity: item.quantity,
  //         price: item.price
  //       }))
  //     }));
  //     
  //     setOrders(transformedData);
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //     toast({
  //       title: "Error",
  //       description: "Could not load your orders. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real implementation, we would update the order status in Supabase
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Order updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Package className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-blue-500">Processing</Badge>;
      case 'shipped':
        return <Badge variant="default" className="bg-amber-500">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  if (isLoading) {
    return <div className="p-8 text-center">Loading your orders...</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), 'PPP')}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="font-bold text-primary mt-1">
                      ₹{order.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Buyer: {order.buyer.full_name}</p>
                  <div className="mt-2 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p>{item.title}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  {order.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'processing')}
                    >
                      Process Order
                    </Button>
                  )}
                  
                  {order.status === 'processing' && (
                    <Button 
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'shipped')}
                    >
                      Mark as Shipped
                    </Button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <Button 
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'delivered')}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
