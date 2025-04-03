
import { ReactNode } from 'react';

// Service interface definitions
export interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
  subservices: SubService[];
}

export interface SubService {
  id: string;
  name: string;
  description?: string;
  price?: number;
  tags?: string[];
  estimated_time?: string;
  warranty?: string;
  urgent_service_available?: boolean;
}

// Price mapping for services
export const servicePricing: {
  [categoryId: string]: { [serviceId: string]: number };
} = {
  appliance: {
    washing_machine: 349,
    refrigerator: 499,
    air_conditioner: 649,
    microwave: 299,
    dishwasher: 399
  },
  electronic: {
    television: 399,
    computer: 499,
    smartphone: 299,
    laptop: 449,
    gaming_console: 349
  },
  plumbing: {
    leak_repair: 299,
    drain_cleaning: 349,
    tap_installation: 249,
    toilet_repair: 399,
    water_heater: 549
  },
  electrical: {
    wiring: 499,
    switch_repair: 249,
    lighting: 299,
    fan_installation: 399,
    circuit_breaker: 549
  },
  carpentry: {
    furniture_repair: 449,
    door_repair: 349,
    cabinet_installation: 649,
    shelving: 399,
    windows: 549
  }
};

// Service statuses
export type ServiceStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

// Service lead type
export interface ServiceLead {
  id: string;
  user_id?: string;
  customer_name: string;
  phone: string;
  service_category: string;
  service_type: string;
  description?: string;
  address: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  urgent?: boolean;
  created_at?: string;
  updated_at?: string;
  provider_id?: string;
  amount?: number;
}

// Popular service interface
export interface PopularService {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  category?: string;
}

// Service Provider interface
export interface ServiceProvider {
  id: string;
  business_name?: string;
  provider_type?: string;
  services?: string[];
  phone?: string;
  address?: string;
  status?: string;
  documents?: string[];
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

// Service Booking interface
export interface ServiceBooking {
  id: string;
  service_id: string;
  service_name: string;
  customer_id: string;
  provider_id?: string;
  booking_date: string;
  booking_time: string;
  status: ServiceStatus;
  price: number;
  notes?: string;
  created_at: string;
}

// Service review interface
export interface ServiceReview {
  id: string;
  service_id: string;
  booking_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
