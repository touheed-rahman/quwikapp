
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Rahul Sharma",
    avatar: "/placeholder.svg",
    role: "Homeowner",
    testimonial: "The plumber arrived on time and fixed our leaking sink in under an hour. Very professional and clean work!",
    rating: 5,
    service: "Plumbing Services"
  },
  {
    name: "Priya Patel",
    avatar: "/placeholder.svg",
    role: "Business Owner",
    testimonial: "We had our office electrical wiring completely redone. The team was efficient and followed all safety protocols.",
    rating: 5,
    service: "Electrical Services"
  },
  {
    name: "Amit Verma",
    avatar: "/placeholder.svg",
    role: "Apartment Resident",
    testimonial: "The AC repair was done quickly and the technician explained everything clearly. My AC works better than before!",
    rating: 4,
    service: "AC Repair"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
        />
      ))}
    </div>
  );
};

const ServiceTestimonials = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="my-12"
    >
      <h2 className="text-xl font-bold mb-2 text-center">Customer Testimonials</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto">
        See what our customers are saying about our services and professionals
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 * (index + 1) }}
            className="h-full"
          >
            <Card className="h-full border border-primary/5 hover:border-primary/20 transition-all">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex-grow italic">"{testimonial.testimonial}"</p>
                <div className="mt-4 pt-4 border-t text-sm text-primary font-medium">
                  {testimonial.service}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceTestimonials;
