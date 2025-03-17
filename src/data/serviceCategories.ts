
import { Home, Zap, Smartphone, Car, Scissors, HeartPulse, BookOpen, Droplet, Shirt, Bike, PaintBucket, Utensils, Wifi } from "lucide-react";

export const serviceCategories = [
  { 
    id: "home", 
    name: "Home Services", 
    icon: Home, 
    color: "from-blue-500/10 to-blue-500/30", 
    hoverColor: "hover:bg-blue-500/20",
    subservices: [
      { id: "cleaning", name: "Home Cleaning" },
      { id: "plumbing", name: "Plumbing" },
      { id: "electrical", name: "Electrical Work" },
      { id: "painting", name: "Painting" },
      { id: "carpentry", name: "Carpentry" },
      { id: "pest_control", name: "Pest Control" },
      { id: "flooring", name: "Flooring Installation" },
      { id: "roofing", name: "Roof Repair" }
    ]
  },
  { 
    id: "electronic", 
    name: "Electronics Repair", 
    icon: Zap, 
    color: "from-amber-500/10 to-amber-500/30", 
    hoverColor: "hover:bg-amber-500/20",
    subservices: [
      { id: "tv_repair", name: "TV Repair" },
      { id: "ac_service", name: "AC Repair & Service" },
      { id: "refrigerator", name: "Refrigerator Repair" },
      { id: "washing_machine", name: "Washing Machine Repair" },
      { id: "microwave", name: "Microwave Repair" },
      { id: "water_purifier", name: "Water Purifier Service" },
      { id: "geyser", name: "Geyser Repair" }
    ]
  },
  { 
    id: "mobile", 
    name: "Mobile & Computer", 
    icon: Smartphone, 
    color: "from-green-500/10 to-green-500/30", 
    hoverColor: "hover:bg-green-500/20",
    subservices: [
      { id: "mobile_repair", name: "Mobile Repair" },
      { id: "computer_repair", name: "Computer Repair" },
      { id: "data_recovery", name: "Data Recovery" },
      { id: "screen_replacement", name: "Screen Replacement" },
      { id: "virus_removal", name: "Virus Removal" },
      { id: "laptop_repair", name: "Laptop Repair" },
      { id: "network_setup", name: "Network Setup" }
    ]
  },
  { 
    id: "car", 
    name: "Vehicle Services", 
    icon: Car, 
    color: "from-red-500/10 to-red-500/30", 
    hoverColor: "hover:bg-red-500/20",
    subservices: [
      { id: "car_repair", name: "Car Repair" },
      { id: "car_wash", name: "Car Wash & Detailing" },
      { id: "bike_service", name: "Bike Service" },
      { id: "oil_change", name: "Oil Change" },
      { id: "towing", name: "Towing Service" },
      { id: "tire_service", name: "Tire Service" },
      { id: "battery_service", name: "Battery Replacement" }
    ]
  },
  { 
    id: "salon", 
    name: "Beauty & Salon", 
    icon: Scissors, 
    color: "from-purple-500/10 to-purple-500/30", 
    hoverColor: "hover:bg-purple-500/20",
    subservices: [
      { id: "haircut", name: "Haircut & Styling" },
      { id: "makeup", name: "Makeup & Facials" },
      { id: "nails", name: "Nail Care" },
      { id: "spa", name: "Spa & Massage" },
      { id: "waxing", name: "Waxing" },
      { id: "threading", name: "Threading" },
      { id: "hair_coloring", name: "Hair Coloring" }
    ]
  },
  { 
    id: "health", 
    name: "Health & Fitness", 
    icon: HeartPulse, 
    color: "from-pink-500/10 to-pink-500/30", 
    hoverColor: "hover:bg-pink-500/20",
    subservices: [
      { id: "personal_training", name: "Personal Training" },
      { id: "yoga", name: "Yoga Classes" },
      { id: "nutrition", name: "Nutritionist Consultation" },
      { id: "physiotherapy", name: "Physiotherapy" },
      { id: "dietitian", name: "Dietitian Services" },
      { id: "mental_health", name: "Mental Health Consultation" },
      { id: "elder_care", name: "Elder Care Services" }
    ]
  },
  { 
    id: "education", 
    name: "Education & Tutoring", 
    icon: BookOpen, 
    color: "from-orange-500/10 to-orange-500/30", 
    hoverColor: "hover:bg-orange-500/20",
    subservices: [
      { id: "math_tutor", name: "Math Tutoring" },
      { id: "language", name: "Language Learning" },
      { id: "coding", name: "Coding Classes" },
      { id: "test_prep", name: "Test Preparation" },
      { id: "music_lessons", name: "Music Lessons" },
      { id: "science_tutor", name: "Science Tutoring" },
      { id: "art_classes", name: "Art Classes" }
    ]
  },
  { 
    id: "cleaning", 
    name: "Cleaning Services", 
    icon: Droplet, 
    color: "from-cyan-500/10 to-cyan-500/30", 
    hoverColor: "hover:bg-cyan-500/20",
    subservices: [
      { id: "home_cleaning", name: "Home Deep Cleaning" },
      { id: "carpet_cleaning", name: "Carpet Cleaning" },
      { id: "laundry", name: "Laundry Services" },
      { id: "disinfection", name: "Sanitization & Disinfection" },
      { id: "office_cleaning", name: "Office Cleaning" },
      { id: "pool_cleaning", name: "Pool Cleaning" },
      { id: "window_cleaning", name: "Window Cleaning" }
    ]
  },
  { 
    id: "fashion", 
    name: "Fashion & Apparel", 
    icon: Shirt, 
    color: "from-indigo-500/10 to-indigo-500/30", 
    hoverColor: "hover:bg-indigo-500/20",
    subservices: [
      { id: "tailoring", name: "Tailoring & Alterations" },
      { id: "custom_design", name: "Custom Clothing Design" },
      { id: "shoe_repair", name: "Shoe Repair" },
      { id: "jewelry_repair", name: "Jewelry Repair" },
      { id: "costume_rental", name: "Costume Rental" },
      { id: "wedding_dress", name: "Wedding Dress Alterations" },
      { id: "fashion_consulting", name: "Personal Styling" }
    ]
  },
  { 
    id: "sports", 
    name: "Sports & Recreation", 
    icon: Bike, 
    color: "from-green-600/10 to-green-600/30", 
    hoverColor: "hover:bg-green-600/20",
    subservices: [
      { id: "bike_repair", name: "Bicycle Repair" },
      { id: "sports_coach", name: "Sports Coaching" },
      { id: "equipment_repair", name: "Sports Equipment Repair" },
      { id: "swimming_lessons", name: "Swimming Lessons" },
      { id: "fitness_assessment", name: "Fitness Assessment" },
      { id: "adventure_tours", name: "Adventure Tours" }
    ]
  },
  { 
    id: "home_improvement", 
    name: "Home Improvement", 
    icon: PaintBucket, 
    color: "from-yellow-500/10 to-yellow-500/30", 
    hoverColor: "hover:bg-yellow-500/20",
    subservices: [
      { id: "interior_design", name: "Interior Design" },
      { id: "furniture_assembly", name: "Furniture Assembly" },
      { id: "home_theater", name: "Home Theater Setup" },
      { id: "smart_home", name: "Smart Home Installation" },
      { id: "kitchen_remodel", name: "Kitchen Remodeling" },
      { id: "bathroom_remodel", name: "Bathroom Remodeling" }
    ]
  },
  { 
    id: "food", 
    name: "Food & Catering", 
    icon: Utensils, 
    color: "from-red-400/10 to-red-400/30", 
    hoverColor: "hover:bg-red-400/20",
    subservices: [
      { id: "catering", name: "Event Catering" },
      { id: "personal_chef", name: "Personal Chef" },
      { id: "cooking_classes", name: "Cooking Classes" },
      { id: "meal_prep", name: "Meal Preparation" },
      { id: "specialty_baking", name: "Specialty Baking" },
      { id: "food_delivery", name: "Food Delivery" }
    ]
  },
  { 
    id: "tech_services", 
    name: "Tech Support", 
    icon: Wifi, 
    color: "from-blue-400/10 to-blue-400/30", 
    hoverColor: "hover:bg-blue-400/20",
    subservices: [
      { id: "it_support", name: "IT Support" },
      { id: "website_development", name: "Website Development" },
      { id: "app_development", name: "App Development" },
      { id: "digital_marketing", name: "Digital Marketing" },
      { id: "seo_services", name: "SEO Services" },
      { id: "tech_training", name: "Technology Training" }
    ]
  },
];
