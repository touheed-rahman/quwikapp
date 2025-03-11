
import { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart, LineChart, ChevronRight, Package, DollarSign, Users } from "lucide-react";
import SellerProducts from "@/components/seller/SellerProducts";
import SellerOrders from "@/components/seller/SellerOrders";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Get seller details
  const { data: seller, isLoading: sellerLoading } = useQuery({
    queryKey: ['seller-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Get seller stats
  const { data: stats } = useQuery({
    queryKey: ['seller-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Count active listings
      const { count: activeListings } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'approved');
      
      // Count total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id);
        
      // Calculate revenue (mock for now)
      const totalRevenue = 12500;
        
      // Count total customers
      const { count: totalCustomers } = await supabase
        .from('orders')
        .select('buyer_id', { count: 'exact', head: true })
        .eq('seller_id', user.id)
        .is('buyer_id', 'not.null');
        
      return {
        activeListings: activeListings || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalCustomers: totalCustomers || 0
      };
    },
    enabled: !!seller,
  });

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-20 pb-24">
          <div className="flex items-center justify-center h-[60vh]">
            <p>Loading seller data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your products, track orders, and analyze performance
            </p>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.activeListings || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +5 from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +3 from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/* Placeholder for Line Chart */}
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      <LineChart className="h-8 w-8 mr-2" />
                      <span>Sales data visualization would appear here</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Popular Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for Bar Chart */}
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      <BarChart className="h-8 w-8 mr-2" />
                      <span>Product popularity chart would appear here</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => navigate('/sell')}
                  className="gap-1"
                >
                  Add New Product
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4 mt-6">
              <div className="flex justify-end">
                <Button 
                  onClick={() => navigate('/sell')}
                  className="mb-4 gap-1"
                >
                  Add New Product
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <SellerProducts />
            </TabsContent>
            
            <TabsContent value="orders" className="mt-6">
              <SellerOrders />
            </TabsContent>
          </Tabs>
        </div>
        <MobileNavigation />
      </main>
    </div>
  );
};

export default SellerDashboard;
