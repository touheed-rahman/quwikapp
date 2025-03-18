
import React, { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle2, Clock, MoreHorizontal, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import ServiceNavigation from "@/components/services/ServiceNavigation";

// Mock data for service bookings
const serviceBookings = [
  {
    id: "booking-1",
    serviceType: "Plumbing",
    status: "upcoming",
    date: "2023-06-15",
    time: "10:00 AM - 12:00 PM",
    provider: "John Plumber",
    address: "123 Main St, Apt 4B",
    price: 75,
  },
  {
    id: "booking-2",
    serviceType: "Home Cleaning",
    status: "completed",
    date: "2023-06-10",
    time: "02:00 PM - 04:00 PM",
    provider: "Clean Home Inc.",
    address: "123 Main St, Apt 4B",
    price: 120,
    rating: 5,
  },
  {
    id: "booking-3",
    serviceType: "AC Repair",
    status: "cancelled",
    date: "2023-06-05",
    time: "09:00 AM - 11:00 AM",
    provider: "Cool Air Services",
    address: "123 Main St, Apt 4B",
    price: 95,
  },
  {
    id: "booking-4",
    serviceType: "Electrical Work",
    status: "completed",
    date: "2023-05-28",
    time: "01:00 PM - 03:00 PM",
    provider: "Bright Spark Electrical",
    address: "123 Main St, Apt 4B",
    price: 150,
    rating: 4,
  },
];

// Service booking card component
const ServiceBookingCard = ({ booking }: { booking: any }) => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} booking`,
      description: `Your ${booking.serviceType} booking has been ${action.toLowerCase()}.`,
      variant: "default",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-primary/10 overflow-hidden">
        <CardHeader className="bg-muted/30 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{booking.serviceType}</CardTitle>
            <Badge
              variant={
                booking.status === "upcoming"
                  ? "default"
                  : booking.status === "completed"
                  ? "success"
                  : "destructive"
              }
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(booking.date).toLocaleDateString()} at {booking.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Provider: {booking.provider}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-muted flex items-center justify-between">
              <span className="font-semibold">${booking.price}</span>
              {booking.status === "upcoming" ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleAction("Cancelled")}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("Rescheduled")}
                  >
                    Reschedule
                  </Button>
                </div>
              ) : booking.status === "completed" ? (
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle2
                        key={i}
                        className={`h-4 w-4 ${
                          i < (booking.rating || 0)
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleAction("Rebooked")}>
                      Book Again
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("Reported")}>
                      Report Issue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MyServices = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Filter bookings based on active tab
  const filteredBookings = serviceBookings.filter((booking) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pb-20">
      <Header />
      <main className="container mx-auto px-4 pt-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Service Bookings</h1>
          <p className="text-muted-foreground">
            Track and manage all your service appointments
          </p>
        </div>

        <Tabs
          defaultValue="upcoming"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookings.map((booking) => (
                  <ServiceBookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground">
                  You don't have any {activeTab !== "all" ? activeTab : ""} service
                  bookings.
                </p>
                <Button
                  className="mt-6"
                  onClick={() => {
                    window.location.href = "/?tab=services";
                  }}
                >
                  Book a Service
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <ServiceNavigation />
    </div>
  );
};

export default MyServices;
