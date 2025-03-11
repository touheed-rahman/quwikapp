import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CreditCard, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  created_at: string;
  product_id: string;
  product_name: string;
  amount: number;
  payment_status: "pending" | "completed" | "failed";
  invoice_number: string;
  seller_id: string;
  seller_name: string;
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [openInvoice, setOpenInvoice] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please login to view your orders",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch real orders from the database
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          product_id,
          amount,
          payment_status,
          invoice_number,
          seller_id,
          listings(title),
          profiles(full_name)
        `)
        .eq('buyer_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our Order interface
      const transformedOrders = ordersData.map((order: any) => ({
        id: order.id,
        created_at: order.created_at,
        product_id: order.product_id,
        product_name: order.listings?.title || "Unknown Product",
        amount: order.amount,
        payment_status: order.payment_status || "pending",
        invoice_number: order.invoice_number || `INV-${order.id.substring(0, 8)}`,
        seller_id: order.seller_id,
        seller_name: order.profiles?.full_name || "Unknown Seller"
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive",
      });
      
      // If no orders exist yet, set empty array
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const viewInvoice = (order: Order) => {
    setSelectedInvoice(order);
    setOpenInvoice(true);
  };

  const downloadInvoice = (order: Order) => {
    toast({
      title: "Invoice download started",
      description: `Invoice ${order.invoice_number} is being downloaded.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <Header />
        <div className="container max-w-6xl mx-auto p-4 pt-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">Loading your orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <Header />
      <div className="container max-w-6xl mx-auto p-4 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Manage and track all your purchases</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{order.product_name}</TableCell>
                          <TableCell>${order.amount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.payment_status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => viewInvoice(order)}
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.filter(o => o.payment_status === "pending").length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No pending payments.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders
                        .filter(order => order.payment_status === "pending")
                        .map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{order.product_name}</TableCell>
                            <TableCell>${order.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="h-8"
                              >
                                <CreditCard className="mr-1 h-3 w-3" />
                                Pay Now
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.filter(o => o.payment_status === "completed").length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No completed payments.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Invoice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders
                        .filter(order => order.payment_status === "completed")
                        .map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{order.product_name}</TableCell>
                            <TableCell>${order.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => viewInvoice(order)}
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="failed">
            <Card>
              <CardHeader>
                <CardTitle>Failed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.filter(o => o.payment_status === "failed").length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No failed payments.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders
                        .filter(order => order.payment_status === "failed")
                        .map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{order.product_name}</TableCell>
                            <TableCell>${order.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="h-8"
                              >
                                <CreditCard className="mr-1 h-3 w-3" />
                                Try Again
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>All Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No invoices available.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.invoice_number}</TableCell>
                          <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{order.product_name}</TableCell>
                          <TableCell>${order.amount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.payment_status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => viewInvoice(order)}
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => downloadInvoice(order)}
                              >
                                <Download className="mr-1 h-3 w-3" />
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invoice Dialog */}
      <Dialog open={openInvoice} onOpenChange={setOpenInvoice}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.invoice_number}</DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="mt-4 space-y-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Quwik</h3>
                  <p className="text-sm text-muted-foreground">123 Commerce Street</p>
                  <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                  <p className="text-sm text-muted-foreground">support@quwik.com</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Invoice To:</div>
                  <div className="text-sm">John Smith</div>
                  <div className="text-sm text-muted-foreground">456 Customer Avenue</div>
                  <div className="text-sm text-muted-foreground">Brooklyn, NY 11201</div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <div>
                  <p className="text-sm font-medium">Invoice Number:</p>
                  <p className="text-sm">{selectedInvoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date Issued:</p>
                  <p className="text-sm">{format(new Date(selectedInvoice.created_at), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status:</p>
                  <div>{getStatusBadge(selectedInvoice.payment_status)}</div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{selectedInvoice.product_name}</TableCell>
                    <TableCell className="text-right">1</TableCell>
                    <TableCell className="text-right">${selectedInvoice.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${selectedInvoice.amount.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex justify-end pt-6 border-t">
                <div className="w-1/3 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t text-center text-sm text-muted-foreground">
                <p>Thank you for your business!</p>
                <p>Payment processed by Quwik Secure Payment.</p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => downloadInvoice(selectedInvoice)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders;
