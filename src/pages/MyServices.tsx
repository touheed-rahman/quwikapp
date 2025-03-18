
import { useState } from "react";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ServiceNavigation from "@/components/services/ServiceNavigation";

// Mock data for service bookings
const serviceBookings = [
  {
    id: "b1",
    service: "Plumbing Repair",
    provider: "Ajay Sharma",
    avatar: "/placeholder.svg",
    date: "2025-04-10T10:00:00",
    status: "upcoming",
    address: "123 Main Street, Bangalore",
    description: "Fix leaking sink in kitchen and bathroom",
    price: 1200
  },
  {
    id: "b2",
    service: "AC Service",
    provider: "Ravi Kumar",
    avatar: "/placeholder.svg",
    date: "2025-04-15T14:00:00",
    status: "upcoming",
    address: "123 Main Street, Bangalore",
    description: "Annual maintenance for 2 ACs",
    price: 2500
  },
  {
    id: "b3",
    service: "Electrical Repair",
    provider: "Sunil Patel",
    avatar: "/placeholder.svg",
    date: "2025-03-25T09:00:00",
    status: "completed",
    address: "123 Main Street, Bangalore",
    description: "Fixed power outlet and ceiling fan",
    price: 800
  },
  {
    id: "b4",
    service: "House Cleaning",
    provider: "Lakshmi Services",
    avatar: "/placeholder.svg",
    date: "2025-03-20T11:00:00",
    status: "completed",
    address: "123 Main Street, Bangalore",
    description: "Full house deep cleaning",
    price: 3000
  }
];

const MyServices = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const upcomingBookings = serviceBookings.filter(booking => booking.status === "upcoming");
  const completedBookings = serviceBookings.filter(booking => booking.status === "completed");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <ServiceNavigation />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Services</h1>
              <p className="text-muted-foreground">Manage all your service bookings in one place</p>
            </div>
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                // Navigate to service booking page
                window.location.href = "/#services";
              }}
            >
              Book New Service
            </Button>
          </div>
          
          {serviceBookings.length > 0 ? (
            <Tabs 
              defaultValue="upcoming" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Upcoming <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/20">{upcomingBookings.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Completed <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/20">{completedBookings.length}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-6">
                {upcomingBookings.map((booking) => (
                  <ServiceBookingCard key={booking.id} booking={booking} />
                ))}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-6">
                {completedBookings.map((booking) => (
                  <ServiceBookingCard key={booking.id} booking={booking} />
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <EmptyBookings />
          )}
        </motion.div>
      </main>
    </div>
  );
};

const ServiceBookingCard = ({ booking }: { booking: any }) => {
  const bookingDate = new Date(booking.date);
  const isUpcoming = booking.status === "upcoming";
  
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/20">
      <CardHeader className="bg-muted/50 flex flex-row items-center gap-4 pb-2">
        <div>
          <Badge className={isUpcoming ? "bg-blue-500" : "bg-green-500"}>
            {isUpcoming ? "Upcoming" : "Completed"}
          </Badge>
          <CardTitle className="mt-2">{booking.service}</CardTitle>
          <CardDescription>Booking ID: {booking.id}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={booking.avatar} />
                <AvatarFallback>{booking.provider.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{booking.provider}</p>
                <p className="text-sm text-muted-foreground">Service Provider</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{bookingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-muted-foreground">
                  {bookingDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Service Details</p>
              <p className="text-sm text-muted-foreground">{booking.description}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Service Address</p>
              <p className="text-sm text-muted-foreground">{booking.address}</p>
            </div>
            
            <div className="bg-muted p-3 rounded-md flex justify-between">
              <span className="text-sm">Service Fee</span>
              <span className="font-semibold">₹{booking.price}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-3 border-t bg-muted/30 px-6 py-4">
        {isUpcoming ? (
          <>
            <Button variant="outline" className="flex-1">Reschedule</Button>
            <Button variant="outline" className="flex-1 text-destructive hover:text-destructive">Cancel Booking</Button>
            <Button className="flex-1 bg-primary text-white hover:bg-primary/90">Contact Provider</Button>
          </>
        ) : (
          <>
            <Button variant="outline" className="flex-1">Book Again</Button>
            <Button variant="outline" className="flex-1">Download Invoice</Button>
            <Button className="flex-1 bg-primary text-white hover:bg-primary/90">Leave Review</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

const EmptyBookings = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-20"
    >
      <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
        <Calendar className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">No service bookings found</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        You don't have any service bookings yet. Start by booking a service to see your bookings here.
      </p>
      <Button 
        className="bg-primary hover:bg-primary/90 text-white"
        onClick={() => {
          window.location.href = "/#services";
        }}
      >
        Book Your First Service
      </Button>
    </motion.div>
  );
};

export default MyServices;
