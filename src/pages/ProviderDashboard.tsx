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
import { 
  Bell, Calendar as CalendarIcon, Check, ChevronDown, ClipboardList, Clock, 
  DollarSign, Home, MapPin, Phone, RefreshCw, Shield, Star, ThumbsUp, 
  Wrench, User, X, Mail, Lock, Building, Briefcase, Tag, Smartphone, Info,
  AlertTriangle, Users as UsersIcon
} from "lucide-react";
import { useServiceLeads } from "@/hooks/useServiceLeads";
import { format } from "date-fns";
import ProviderAuth from "@/services/ProviderAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ServiceCenter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
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
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { leads, isLoading: leadsLoading } = useServiceLeads();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const isProvider = await ProviderAuth.isServiceProvider();
        
        if (isProvider) {
          setIsAuthenticated(true);
          setIsAuthorized(true);
        } else {
          setIsAuthenticated(false);
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [id]: value }));
    setAuthError(null);
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setAuthFormData(prev => ({ ...prev, [name]: value }));
    setAuthError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await ProviderAuth.signInServiceProvider(
        authFormData.email,
        authFormData.password
      );

      if (error) throw error;
      
      setIsAuthenticated(true);
      setIsAuthorized(true);
      
      toast({
        title: "Login successful",
        description: "Welcome to Service Center Dashboard"
      });
    } catch (error: any) {
      setAuthError(error.message || "Authentication failed. Please check your credentials and try again.");
      
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
    setAuthError(null);
    
    if (authFormData.password !== authFormData.confirmPassword) {
      setAuthError("Passwords do not match");
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match."
      });
      setSignupLoading(false);
      return;
    }
    
    if (authFormData.password.length < 6) {
      setAuthError("Password must be at least 6 characters long");
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long."
      });
      setSignupLoading(false);
      return;
    }
    
    try {
      const { data, error } = await ProviderAuth.registerServiceProvider(
        authFormData.email,
        authFormData.password,
        authFormData.fullName,
        authFormData.businessName,
        authFormData.providerType,
        authFormData.services,
        authFormData.phone
      );

      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your service provider application has been submitted for review. You'll be notified once approved."
      });
      setAuthTab("login");
    } catch (error: any) {
      setAuthError(error.message || "Registration failed");
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up."
      });
    } finally {
      setSignupLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await ProviderAuth.signOut();
      setIsAuthenticated(false);
      setIsAuthorized(false);
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
      <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
          <h2 className="text-2xl font-bold">Service Provider Portal</h2>
          <p className="text-white/90 mt-1">
            {authTab === "login" 
              ? "Access your service provider dashboard" 
              : "Join our network of service professionals"}
          </p>
        </div>
        
        <CardContent className="p-6 pt-8">
          <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {authError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
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
                    className="border-input/60"
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
                    className="border-input/60"
                  />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={loginLoading}>
                  {loginLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-blue-800 font-medium">Service Provider Registration</h4>
                    <p className="text-sm text-blue-700">
                      Apply to join our service professional network. Your application will be reviewed by our team.
                    </p>
                  </div>
                </div>
              </div>
              
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
                    className="border-input/60"
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
                    className="border-input/60"
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
                    <SelectTrigger className="border-input/60">
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
                    <SelectTrigger className="border-input/60">
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
                    className="border-input/60"
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
                    className="border-input/60"
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
                    className="border-input/60"
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
                    className="border-input/60"
                  />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={signupLoading}>
                  {signupLoading ? "Creating Account..." : "Apply to Join"}
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
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Join Our Network</h3>
            <p className="text-sm text-muted-foreground">Become a verified service provider and grow your business with new customers</p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Manage Requests</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Easily manage service requests, schedules and customer communications
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Grow Your Business</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Increase your earnings and expand your service offerings
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  
  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 px-4 sm:px-6 md:px-8 pb-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/15 p-4 rounded-xl shadow-sm">
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
          <Button variant="outline" className="relative bg-white shadow-sm h-9 px-2 flex-shrink-0">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>
          <Button variant="outline" className="bg-white shadow-sm text-xs sm:text-sm h-9 flex-shrink-0" onClick={handleSignOut}>
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
            {leadsLoading ? (
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
                          {request.created_at && format(new Date(request.created_at), 'dd MMM yyyy')}
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
                          <span>{request.appointment_date && format(new Date(request.appointment_date), 'dd MMM yyyy')}</span>
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
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-xs h-8"
                          >
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Accept
                          </Button>
                        </>
                      )}
                      {request.status === 'In Progress' && (
                        <Button 
                          size="sm"
                          className="text-xs h-8" 
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
                  req.appointment_date && 
                  new Date(req.appointment_date).toDateString() === (selectedDate?.toDateString() || '')
                ).length > 0 ? (
                  leads.filter(req => 
                    req.status === 'In Progress' && 
                    req.appointment_date && 
                    new Date(req.appointment_date).toDateString() === (selectedDate?.toDateString() || '')
                  ).map(appointment => (
                    <div key={appointment.id} className="flex p-2 sm:p-3 border rounded-lg hover:bg-primary/5 transition-colors">
                      <div className="font-medium w-20 sm:w-24 text-primary text-xs sm:text-sm">
                        {appointment.appointment_time}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">
                          {appointment.service_category} - {appointment.service_type}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {appointment.customer_name} • {appointment.address?.split(',')[0]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-muted/10 rounded-lg">
                    <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-base font-medium">No appointments</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No appointments scheduled for this date
                    </p>
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
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Rating</span>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <span className="font-medium text-sm">5.0</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Jobs</span>
                <span className="font-medium">{leads.filter(req => req.status === 'Completed').length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">On-time Arrival</span>
                <span className="font-medium text-green-600">98%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="font-medium text-green-600">97%</span>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-sm mb-2">Recent Reviews</h4>
                {leads.filter(req => req.status === 'Completed').length > 0 ? (
                  <div className="space-y-2">
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        "Excellent service, very professional and on time. Highly recommend!"
                      </p>
                      <p className="text-xs font-medium mt-1">- Rahul S.</p>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        "Fixed my AC in no time. Great job!"
                      </p>
                      <p className="text-xs font-medium mt-1">- Priya M.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-muted/10 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No reviews yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <RefreshCw className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !isAuthenticated ? (
          renderAuthForm()
        ) : !isAuthorized ? (
          <div className="max-w-2xl mx-auto py-10 text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
            <h2 className="text-2xl font-bold">Service Provider Access Required</h2>
            <p className="text-muted-foreground">
              This area is restricted to approved service providers only. Your account doesn't have the necessary permissions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button variant="outline" onClick={() => navigate("/")}>
                Return to Home
              </Button>
              <Button onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          renderDashboard()
        )}
      </div>
    </div>
  );
};

export default ServiceCenter;
