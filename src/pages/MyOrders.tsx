
import { useState } from "react";
import { motion } from "framer-motion";
import { useServiceLeads } from "@/hooks/useServiceLeads";
import { useSession } from "@/hooks/use-session-user";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Home, 
  Phone, 
  Plus, 
  Settings, 
  ShoppingBag, 
  Star, 
  Truck, 
  Users 
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { user, session, loading } = useSession();
  const { leads, isLoading } = useServiceLeads();
  
  // Filter leads based on user ID
  const userLeads = leads.filter(lead => lead.user_id === user?.id);
  
  // Filter leads by status for different tabs
  const getFilteredLeads = (status?: string) => {
    if (!status || status === 'all') return userLeads;
    return userLeads.filter(lead => lead.status === status);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="container max-w-7xl py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </>
    );
  }
  
  if (!session) {
    return (
      <>
        <Header />
        <div className="container max-w-7xl py-10">
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center space-y-4">
              <Users className="h-16 w-16 text-muted-foreground" />
              <CardTitle className="text-2xl">Sign in to view your orders</CardTitle>
              <CardDescription>You need to be logged in to view your service requests</CardDescription>
              <Button onClick={() => navigate('/profile')} className="mt-4">
                Go to Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-7xl py-10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Service Requests</h1>
            <p className="text-muted-foreground">Track and manage your service bookings</p>
          </div>
          <Button onClick={() => navigate('/service-center')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Book New Service
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Pending">Pending</TabsTrigger>
            <TabsTrigger value="In Progress">In Progress</TabsTrigger>
            <TabsTrigger value="Completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {renderServiceRequests(getFilteredLeads())}
          </TabsContent>
          
          <TabsContent value="Pending" className="space-y-6">
            {renderServiceRequests(getFilteredLeads('Pending'))}
          </TabsContent>
          
          <TabsContent value="In Progress" className="space-y-6">
            {renderServiceRequests(getFilteredLeads('In Progress'))}
          </TabsContent>
          
          <TabsContent value="Completed" className="space-y-6">
            {renderServiceRequests(getFilteredLeads('Completed'))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
  
  function renderServiceRequests(filteredLeads) {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      );
    }
    
    if (filteredLeads.length === 0) {
      return (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center space-y-4">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <CardTitle className="text-xl">No service requests found</CardTitle>
            <CardDescription>
              {activeTab === 'all' 
                ? "You haven't made any service requests yet"
                : `You don't have any ${activeTab.toLowerCase()} service requests`}
            </CardDescription>
            <Button onClick={() => navigate('/service-center')} className="mt-4">
              Book a Service
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return filteredLeads.map((lead) => (
      <Card key={lead.id} className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                {getStatusBadge(lead.status)}
                {lead.urgent && <Badge variant="outline" className="bg-red-50 text-red-700">Urgent</Badge>}
                <span className="text-sm text-muted-foreground">
                  {lead.created_at && `Requested on ${format(new Date(lead.created_at), 'MMM dd, yyyy')}`}
                </span>
              </div>
              <CardTitle className="mt-1">{lead.service_type}</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">₹{lead.amount || 0}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Service Details</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{lead.service_category}</p>
                    <p className="text-muted-foreground">{lead.service_type}</p>
                  </div>
                </div>
                {lead.description && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{lead.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Appointment</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{lead.appointment_date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p>{lead.appointment_time}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p>{lead.customer_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p>{lead.phone}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{lead.address}</p>
                </div>
              </div>
            </div>
            
            {lead.status === 'In Progress' && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Service Provider</h3>
                <div className="border rounded-lg p-3 bg-muted/10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Assigned Professional</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs ml-1 text-muted-foreground">4.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">A qualified professional will arrive at your location during the scheduled time.</p>
                </div>
              </div>
            )}
            
            {lead.status === 'Completed' && (
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg bg-green-50 border-green-100">
                <div className="bg-green-100 p-2 rounded-full mb-2">
                  <ShoppingBag className="h-5 w-5 text-green-700" />
                </div>
                <p className="font-medium text-green-800">Service Completed</p>
                <p className="text-xs text-green-700">Thank you for using our service!</p>
              </div>
            )}
          </div>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="p-4">
          {lead.status === 'Pending' && (
            <Button variant="outline" className="w-full" onClick={() => navigate(`/chat/${lead.id}`)}>
              Contact Support
            </Button>
          )}
          
          {lead.status === 'In Progress' && (
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Service in progress</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">ETA: 2 hours</Badge>
              </div>
              <Button variant="outline" onClick={() => navigate(`/chat/${lead.id}`)}>
                Contact Service Provider
              </Button>
            </div>
          )}
          
          {lead.status === 'Completed' && (
            <Button variant="outline" className="w-full">
              Book Again
            </Button>
          )}
          
          {lead.status === 'Cancelled' && (
            <Button variant="outline" className="w-full" onClick={() => navigate('/service-center')}>
              Book New Request
            </Button>
          )}
        </CardFooter>
      </Card>
    ));
  }
};

export default MyOrders;
