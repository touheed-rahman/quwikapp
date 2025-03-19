import { z } from "zod";

export const formSchema = z.object({
  serviceCategory: z.string().min(1, { message: "Please select a service category" }),
  serviceType: z.string().min(1, { message: "Please select a specific service" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, { message: "Please select a time slot" }),
  address: z.string().min(5, { message: "Please provide your address" }),
  name: z.string().min(2, { message: "Please provide your name" }),
  phone: z.string().min(10, { message: "Please provide a valid phone number" }),
  urgent: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;

// Service Lead Types
export interface ServiceLead {
  id: string;
  customer_name: string;
  phone: string;
  service_category: string;
  service_type: string;
  description: string;
  address: string;
  appointment_date: string;
  appointment_time: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  amount: number;
  urgent: boolean;
  created_at: string;
}

// Service pricing for different service types (keeping prices 50 Rs lower than competitors)
export const servicePricing: Record<string, Record<string, number>> = {
  home: {
    cleaning: 349,
    plumbing: 249,
    electrical: 299,
    painting: 1449,
    carpentry: 349,
    pest_control: 549,
    flooring: 2449,
    roofing: 1249
  },
  electronic: {
    tv_repair: 349,
    ac_service: 499,
    refrigerator: 449,
    washing_machine: 399,
    microwave: 349,
    water_purifier: 299,
    geyser: 349
  },
  mobile: {
    mobile_repair: 249,
    computer_repair: 549,
    data_recovery: 749,
    screen_replacement: 949,
    virus_removal: 349,
    laptop_repair: 649,
    network_setup: 449
  },
  car: {
    car_repair: 949,
    car_wash: 249,
    bike_service: 349,
    oil_change: 649,
    towing: 849,
    tire_service: 249,
    battery_service: 349
  },
  salon: {
    haircut: 199,
    makeup: 649,
    nails: 349,
    spa: 849,
    waxing: 349,
    threading: 149,
    hair_coloring: 849
  },
  health: {
    personal_training: 549,
    yoga: 349,
    nutrition: 449,
    physiotherapy: 549,
    dietitian: 449,
    mental_health: 749,
    elder_care: 449
  },
  education: {
    math_tutor: 349,
    language: 449,
    coding: 549,
    test_prep: 649,
    music_lessons: 449,
    science_tutor: 349,
    art_classes: 399
  },
  cleaning: {
    home_cleaning: 449,
    carpet_cleaning: 549,
    laundry: 349,
    disinfection: 649,
    office_cleaning: 749,
    pool_cleaning: 849,
    window_cleaning: 449
  },
  fashion: {
    tailoring: 349,
    custom_design: 849,
    shoe_repair: 249,
    jewelry_repair: 349,
    costume_rental: 549,
    wedding_dress: 1249,
    fashion_consulting: 649
  },
  sports: {
    bike_repair: 349,
    sports_coach: 549,
    equipment_repair: 349,
    swimming_lessons: 549,
    fitness_assessment: 449,
    adventure_tours: 1249
  },
  home_improvement: {
    interior_design: 1449,
    furniture_assembly: 349,
    home_theater: 649,
    smart_home: 849,
    kitchen_remodel: 2449,
    bathroom_remodel: 2249
  },
  food: {
    catering: 1449,
    personal_chef: 1249,
    cooking_classes: 549,
    meal_prep: 649,
    specialty_baking: 449,
    food_delivery: 149
  },
  tech_services: {
    it_support: 549,
    website_development: 2449,
    app_development: 3449,
    digital_marketing: 1249,
    seo_services: 849,
    tech_training: 649
  }
};
