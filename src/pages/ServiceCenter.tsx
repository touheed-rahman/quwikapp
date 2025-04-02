
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { 
  Bell, Calendar as CalendarIcon, Check, ChevronDown, ClipboardList, Clock, 
  DollarSign, Home, MapPin, Phone, RefreshCw, Shield, Star, ThumbsUp, 
  Wrench, User, X, Mail, Lock, Building, Briefcase, Tag, Smartphone, Info
} from "lucide-react";
import { useServiceLeads, useUpdateServiceLeadStatus } from "@/hooks/useServiceLeads";
import { format } from "date-fns";

const ServiceCenter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("requests");
  const [authFormData, setAuthFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    businessName: '',
    providerType: 'individual',
    services: 'cleaning',
    phone: '',
    confirmPassword: ''
  });
  
  const { leads, isLoading } = useServiceLeads();
  const { updateStatus, isUpdating } = useUpdateServiceLeadStatus();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if service provider is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setAuthFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authFormData.email,
        password: authFormData.password,
      });

      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome to Service Center Dashboard"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again."
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    
    // Password validation
    if (authFormData.password !== authFormData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match."
      });
      setSignupLoading(false);
      return;
    }
    
    if (authFormData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long."
      });
      setSignupLoading(false);
      return;
    }
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: authFormData.email,
        password: authFormData.password,
        options: {
          data: {
            full_name: authFormData.fullName,
            business_name: authFormData.businessName,
            provider_type: authFormData.providerType,
            services: authFormData.services,
            phone: authFormData.phone,
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Account created successfully",
        description: "Please verify your email to complete registration"
      });
      setAuthTab("login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up."
      });
    } finally {
      setSignupLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    updateStatus({ leadId: id, status: status as any });
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "An error occurred while signing out."
      });
    }
  };

  const renderAuthForm = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Service Provider Portal</CardTitle>
          <CardDescription className="text-center">
            {authTab === "login" 
              ? "Sign in to your service provider account" 
              : "Create a new service provider account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    autoComplete="email"
                    value={authFormData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <Input 
                    id="password" 
                    type="password"
                    autoComplete="current-password"
                    value={authFormData.password}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input 
                    id="fullName" 
                    placeholder="John Doe" 
                    value={authFormData.fullName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    Business Name
                  </Label>
                  <Input 
                    id="businessName" 
                    placeholder="Your Service Business" 
                    value={authFormData.businessName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="providerType" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Provider Type
                  </Label>
                  <Select 
                    value={authFormData.providerType}
                    onValueChange={(value) => handleSelectChange('providerType', value)}
                  >
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
                  <Label htmlFor="services" className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Services Offered
                  </Label>
                  <Select 
                    value={authFormData.services}
                    onValueChange={(value) => handleSelectChange('services', value)}
                  >
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
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 9876543210" 
                    value={authFormData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={authFormData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={authFormData.password}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Confirm Password
                  </Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={authFormData.confirmPassword}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={signupLoading}>
                  {signupLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <Button variant="link" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 px-4 sm:px-6 md:px-8 pb-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Service Provider Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your service requests and bookings</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex items-center gap-1 text-xs sm:text-sm bg-white shadow-sm h-9" onClick={() => window.location.reload()}>
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button className="flex items-center gap-1 text-xs sm:text-sm h-9">
            <Wrench className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Add Service</span>
          </Button>
          <Button variant="outline" className="relative bg-white shadow-sm h-9 px-2">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>
          <Button variant="outline" className="bg-white shadow-sm text-xs sm:text-sm h-9" onClick={handleSignOut}>
            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Mobile tabs for navigation */}
      <div className="md:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-blue-700">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700">
              {leads.filter(req => req.status === 'Pending').length}
            </div>
            <p className="text-xs sm:text-sm text-blue-600/70">New service requests waiting for action</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-amber-700">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-amber-700">
              {leads.filter(req => req.status === 'In Progress').length}
            </div>
            <p className="text-xs sm:text-sm text-amber-600/70">Services currently being provided</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-green-700">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-green-700">
              {leads.filter(req => req.status === 'Completed').length}
            </div>
            <p className="text-xs sm:text-sm text-green-600/70">Successfully completed service requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Conditional content based on mobile tab */}
      <div className={activeTab === "requests" || activeTab === "calendar" ? "block" : "hidden md:block"}>
        <Card className="shadow-md border-primary/10">
          <CardHeader className="bg-primary/5 p-3 sm:p-4">
            <CardTitle className="flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-2 text-base sm:text-lg">
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Service Requests
              </span>
              <div className="flex items-center gap-2">
                <Label htmlFor="statusFilter" className="text-xs sm:text-sm font-normal hidden sm:block">Filter by:</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] sm:w-[180px] bg-white text-xs sm:text-sm h-8 sm:h-9">
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
          <CardContent className="p-3 sm:p-4">
            {isLoading ? (
              <div className="text-center py-10">
                <RefreshCw className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary mx-auto mb-4" />
                <p>Loading service requests...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-10 bg-muted/20 rounded-lg">
                <ClipboardList className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No service requests found</h3>
                <p className="text-sm text-muted-foreground">New service requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((request) => (
                  <motion.div 
                    key={request.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                      <div>
                        <div className="flex flex-wrap items-center gap-1 mb-2">
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
                        <h3 className="font-medium text-base sm:text-lg">{request.service_category} - {request.service_type}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 my-1">
                          {request.description || "No description provided"}
                        </p>
                      </div>
                      <div className="text-right self-end sm:self-start">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {format(new Date(request.created_at), 'dd MMM yyyy')}
                        </p>
                        {request.amount && (
                          <p className="font-bold text-primary">₹{request.amount}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="font-medium">{request.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span>{request.phone}</span>
                        </div>
                        <div className="flex items-start gap-1 text-xs sm:text-sm">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5" />
                          <span className="line-clamp-2">{request.address}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span>{format(new Date(request.appointment_date), 'dd MMM yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span>{request.appointment_time}</span>
                        </div>
                        {request.payment_method && (
                          <div className="flex items-center gap-1 text-xs sm:text-sm">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <span>{request.payment_method}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex flex-wrap justify-end gap-2">
                      {request.status === 'Pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8"
                            onClick={() => handleStatusUpdate(request.id, 'Cancelled')}
                            disabled={isUpdating}
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-xs h-8"
                            onClick={() => handleStatusUpdate(request.id, 'In Progress')}
                            disabled={isUpdating}
                          >
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Accept
                          </Button>
                        </>
                      )}
                      {request.status === 'In Progress' && (
                        <Button 
                          size="sm"
                          className="text-xs h-8" 
                          onClick={() => handleStatusUpdate(request.id, 'Completed')}
                          disabled={isUpdating}
                        >
                          <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Mark Complete
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-xs h-8">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${activeTab === "stats" ? "block" : "hidden md:grid"}`}>
        <Card className="md:col-span-2 border-primary/10 shadow-md">
          <CardHeader className="bg-primary/5 p-3 sm:p-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mx-auto"
                />
              </div>
              
              <div className="md:w-1/2 space-y-2">
                <h3 className="font-medium text-primary flex items-center gap-2 mb-3 text-sm sm:text-base">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                </h3>
                
                {leads.filter(req => 
                  req.status === 'In Progress' && 
                  new Date(req.appointment_date).toDateString() === (selectedDate?.toDateString() || '')
                ).map(appointment => (
                  <div key={appointment.id} className="flex p-2 sm:p-3 border rounded-lg hover:bg-primary/5 transition-colors">
                    <div className="font-medium w-20 sm:w-24 text-primary text-xs sm:text-sm">{appointment.appointment_time}</div>
                    <div className="flex-1">
                      <div className="font-medium text-xs sm:text-sm">{appointment.service_type}</div>
                      <div className="text-xs text-muted-foreground">{appointment.customer_name}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 sm:h-8 px-2 text-xs">View</Button>
                  </div>
                ))}
                
                {leads.filter(req => 
                  req.status === 'In Progress' && 
                  new Date(req.appointment_date).toDateString() === (selectedDate?.toDateString() || '')
                ).length === 0 && (
                  <div className="text-center py-6 text-muted-foreground bg-slate-50 rounded-lg border border-dashed text-xs sm:text-sm">
                    No appointments scheduled for this day
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-md">
          <CardHeader className="bg-primary/5 p-3 sm:p-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Performance Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Star className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-500" />
                <span>Average Rating</span>
              </div>
              <div className="font-bold text-xs sm:text-sm">4.8/5</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-5 sm:w-5 text-blue-500" />
                <span>Response Time</span>
              </div>
              <div className="font-bold text-xs sm:text-sm">32 min</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-5 sm:w-5 text-green-500" />
                <span>Completion Rate</span>
              </div>
              <div className="font-bold text-xs sm:text-sm">98%</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <DollarSign className="h-3 w-3 sm:h-5 sm:w-5 text-emerald-500" />
                <span>This Month</span>
              </div>
              <div className="font-bold text-xs sm:text-sm">₹12,450</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Home className="h-3 w-3 sm:h-5 sm:w-5 text-purple-500" />
                <span>Total Services</span>
              </div>
              <div className="font-bold text-xs sm:text-sm">42</div>
            </div>
            <Button variant="default" className="w-full mt-2 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9">View Full Report</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  return (
    <>
      <Header />
      <div className="container max-w-7xl pb-6">
        {!isAuthenticated ? renderAuthForm() : renderDashboard()}
      </div>
    </>
  );
};

export default ServiceCenter;
