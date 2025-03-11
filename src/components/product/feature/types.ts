
import { ReactNode } from "react";

export interface FeatureOption {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  icon: ReactNode;
}

export interface UserDetails {
  name: string;
  phone: string;
  address: string;
}

export interface OrderData {
  product_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  payment_status: string;
  invoice_number: string;
  order_type: string;
  feature_type: string;
  contact_name: string;
  contact_phone: string;
  contact_address: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: {
    description: string;
    amount: number;
    originalPrice?: number;
  }[];
  total: number;
  companyName: string;
  companyAddress: string;
  discount?: number;
}
