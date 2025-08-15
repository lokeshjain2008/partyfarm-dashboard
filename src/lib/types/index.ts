import type { Database } from './database.js';

// Re-export database types
export type { Database } from './database.js';

// Application-specific types based on design document
export interface User {
  id: string;
  email: string;
  full_name: string;
  role?: Database['public']['Enums']['user_role'];
  organization_id?: string;
  property_access?: string[];
  status: Database['public']['Enums']['user_status'];
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  guest_range: { min: number; max: number };
  price: number;
}

export interface PropertyPricing {
  pricing_type: 'tiered' | 'flat';
  
  // For tiered pricing
  weekday_tiers?: PricingTier[];
  weekend_tiers?: PricingTier[];
  festival_tiers?: PricingTier[];
  
  // For flat pricing
  flat_rates?: {
    weekday: number;
    weekend: number;
    festival: number;
  };
  
  // Optional special date pricing
  special_dates?: {
    [date: string]: { multiplier: number } | { fixed_price: number };
  };
}

export interface Amenity {
  id: string;
  name: string;
  description?: string;
  type: 'free' | 'paid';
  price?: number;
  pricing_type?: 'per_person' | 'per_booking' | 'per_hour';
  category: 'accommodation' | 'recreation' | 'catering' | 'entertainment' | 'transport';
}

export interface Property {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  category: 'farmhouse' | 'banquet_hall';
  capacity: number;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  amenities: Amenity[];
  images: string[];
  pricing_config: PropertyPricing;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface BookingAmenity {
  amenity_id: string;
  amenity_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
}

export interface PaymentTransaction {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: Database['public']['Enums']['payment_method'];
  payment_type: Database['public']['Enums']['payment_type'];
  transaction_status: Database['public']['Enums']['transaction_status'];
  transaction_reference?: string;
  payment_date?: string;
  recorded_by: string;
  notes?: string;
  gateway_response?: any;
  created_at: string;
  updated_at: string;
}

export interface BookingPayment {
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  advance_required?: number;
  advance_percentage?: number;
  payment_schedule?: {
    advance_amount: number;
    advance_due_date: string;
    final_amount: number;
    final_due_date: string;
  };
  transactions: PaymentTransaction[];
}

export interface Booking {
  id: string;
  property_id: string;
  customer_details: {
    name: string;
    email: string;
    phone: string;
    event_type: string;
    guest_count: number;
  };
  booking_dates: {
    start_date: string;
    end_date: string;
    duration_type: 'daily' | 'hourly';
  };
  selected_amenities: BookingAmenity[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  pricing: {
    base_amount: number;
    amenities_total: number;
    total_amount: number;
    pricing_breakdown: {
      date: string;
      guest_count: number;
      rate_applied: number;
      day_type: 'weekday' | 'weekend' | 'festival';
    }[];
  };
  payment_info: BookingPayment;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  property_id: string;
  date: string;
  is_available: boolean;
  pricing: number;
  blocked_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'inhouse' | 'farmhouse';
  contact_details?: any;
  created_at: string;
  updated_at: string;
}