
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    image: "/placeholder.svg",
    content: "The plumbing service was exceptional. The technician arrived on time, identified the issue quickly, and fixed it with minimal disruption. I'll definitely use this service again!",
    service: "Plumbing",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Professional",
    image: "/placeholder.svg",
    content: "I needed my AC fixed on the hottest day of the year. Not only did they respond within an hour, but the technician was extremely knowledgeable and fixed the issue quickly. Outstanding service!",
    service: "AC Repair",
    rating: 5
  },
  {
    id: 3,
    name: "Jennifer Williams",
    role: "Apartment Resident",
    image: "/placeholder.svg",
    content: "I've tried several cleaning services, but this one stands out. The team was thorough, professional, and made my apartment look better than when I moved in. Highly recommended!",
    service: "Home Cleaning",
    rating: 4
  },
  {
    id: 4,
    name: "David Patel",
    role: "Business Owner",
    image: "/placeholder.svg",
    content: "Had our office electrical issues solved promptly. The service was efficient and the price was reasonable. Our business was back up and running with minimal downtime.",
    service: "Electrical Work",
    rating: 5
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} 
        />
      ))}
    </div>
  );
};

const ServiceTestimonials = () => {
  return (
    <motion.div 
      className="my-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">What Our Customers Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Don't just take our word for it. Here's what customers think about our services.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <motion.div 
            key={testimonial.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full bg-gradient-to-b from-muted/50 to-white border-muted overflow-hidden">
              <CardContent className="p-6">
                <div className="absolute top-6 right-6 text-primary opacity-20">
                  <Quote className="h-10 w-10" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <StarRating rating={testimonial.rating} />
                </div>
                
                <p className="text-muted-foreground italic mb-3">"{testimonial.content}"</p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-muted">
                  <span className="text-sm text-muted-foreground">Service: <span className="font-medium text-foreground">{testimonial.service}</span></span>
                  <span className="text-xs text-muted-foreground">Verified Customer</span>
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
