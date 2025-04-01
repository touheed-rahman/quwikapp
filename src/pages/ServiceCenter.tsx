
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Calendar as CalendarIcon, Check, ChevronDown, ClipboardList, Clock, DollarSign, Home, MapPin, Phone, RefreshCw, Shield, Star, ThumbsUp, Wrench, User, X } from "lucide-react";

const ServiceCenter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if service provider is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        fetchServiceLeads();
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchServiceLeads = async () => {
    try {
      setLoading(true);
      // In a real app, we would fetch service leads assigned to this provider
      // For demo, we'll use the service_leads table
      const { data, error } = await supabase
        .from('service_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServiceRequests(data || []);
    } catch (error) {
      console.error('Error fetching service leads:', error);
      toast({
        variant: "destructive",
        title: "Error fetching service requests",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login functionality
    // This is a placeholder - you'll need to implement actual authentication
    try {
      toast({
        title: "Login successful",
        description: "Welcome to Service Center Dashboard"
      });
      setIsAuthenticated(true);
      fetchServiceLeads();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again."
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement signup functionality
    toast({
      title: "Account created successfully",
      description: "Please verify your email to complete registration"
    });
    setAuthTab("login");
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('service_leads')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Service request status updated to ${status}`
      });
      
      // Refresh service leads
      fetchServiceLeads();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: "Please try again later."
      });
    }
  };

  const renderAuthForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Service Provider Portal</CardTitle>
        <CardDescription>
          {authTab === "login" 
            ? "Sign in to your service provider account" 
            : "Create a new service provider account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={authTab} onValueChange={setAuthTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Your Service Business" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="providerType">Provider Type</Label>
                <Select defaultValue="individual">
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Professional</SelectItem>
                    <SelectItem value="authorized">Authorized Service Center</SelectItem>
                    <SelectItem value="company">Service Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="services">Services Offered</Label>
                <Select defaultValue="cleaning">
                  <SelectTrigger>
                    <SelectValue placeholder="Select service category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Home Cleaning</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="appliance">Appliance Repair</SelectItem>
                    <SelectItem value="multiple">Multiple Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+91 9876543210" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" required />
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Service Provider Dashboard</h2>
          <p className="text-muted-foreground">Manage your service requests and bookings</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={fetchServiceLeads}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Wrench className="h-4 w-4" /> Add New Service
          </Button>
          <Button variant="outline" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {serviceRequests.filter(req => req.status === 'Pending').length}
            </div>
            <p className="text-muted-foreground text-sm">New service requests waiting for action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {serviceRequests.filter(req => req.status === 'In Progress').length}
            </div>
            <p className="text-muted-foreground text-sm">Services currently being provided</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {serviceRequests.filter(req => req.status === 'Completed').length}
            </div>
            <p className="text-muted-foreground text-sm">Successfully completed service requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Service Requests</span>
            <div className="flex items-center gap-2">
              <Label htmlFor="statusFilter">Filter by:</Label>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <RefreshCw className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p>Loading service requests...</p>
            </div>
          ) : serviceRequests.length === 0 ? (
            <div className="text-center py-10 bg-muted/20 rounded-lg">
              <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No service requests found</h3>
              <p className="text-muted-foreground">New service requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {serviceRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          className={
                            request.status === 'Pending' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                            request.status === 'In Progress' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                            request.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                        >
                          {request.status}
                        </Badge>
                        {request.urgent && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-lg">{request.service_category} - {request.service_type}</h3>
                      <p className="text-muted-foreground line-clamp-2 my-1">
                        {request.description || "No description provided"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                      {request.amount && (
                        <p className="font-bold text-primary">₹{request.amount}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{request.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex items-start gap-1 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="line-clamp-2">{request.address}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(request.appointment_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{request.appointment_time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-end gap-2">
                    {request.status === 'Pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(request.id, 'Cancelled')}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(request.id, 'In Progress')}
                        >
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                      </>
                    )}
                    {request.status === 'In Progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(request.id, 'Completed')}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" /> Mark Complete
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border mx-auto"
            />
            
            <div className="mt-4 space-y-2">
              {serviceRequests.filter(req => 
                req.status === 'In Progress' && 
                new Date(req.appointment_date).toDateString() === (selectedDate?.toDateString() || '')
              ).map(appointment => (
                <div key={appointment.id} className="flex p-2 border rounded-lg hover:bg-muted/10">
                  <div className="font-medium w-24">{appointment.appointment_time}</div>
                  <div className="flex-1">
                    <div className="font-medium">{appointment.service_type}</div>
                    <div className="text-sm text-muted-foreground">{appointment.customer_name}</div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
              
              {serviceRequests.filter(req => 
                req.status === 'In Progress' && 
                new Date(req.appointment_date).toDateString() === (selectedDate?.toDateString() || '')
              ).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No appointments scheduled for this day
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Average Rating</span>
              </div>
              <div className="font-bold">4.8/5</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Response Time</span>
              </div>
              <div className="font-bold">32 min</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Completion Rate</span>
              </div>
              <div className="font-bold">98%</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <span>This Month</span>
              </div>
              <div className="font-bold">₹12,450</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-purple-500" />
                <span>Total Services</span>
              </div>
              <div className="font-bold">42</div>
            </div>
            <Button variant="outline" className="w-full mt-4">View Full Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="container max-w-7xl py-6 px-4">
        {!isAuthenticated ? renderAuthForm() : renderDashboard()}
      </div>
    </>
  );
};

export default ServiceCenter;
