-- Create enums for consistent data types
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'inhouse_admin', 
  'inhouse_manager', 
  'inhouse_viewer',
  'farmhouse_owner', 
  'farmhouse_admin', 
  'farmhouse_staff'
);

CREATE TYPE user_status AS ENUM (
  'pending',
  'active',
  'inactive'
);

CREATE TYPE organization_type AS ENUM (
  'inhouse',
  'farmhouse'
);

CREATE TYPE property_category AS ENUM (
  'farmhouse',
  'banquet_hall'
);

CREATE TYPE property_status AS ENUM (
  'active',
  'inactive',
  'maintenance'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

CREATE TYPE duration_type AS ENUM (
  'daily',
  'hourly'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'partial',
  'completed'
);

CREATE TYPE pricing_type AS ENUM (
  'tiered',
  'flat'
);

CREATE TYPE day_type AS ENUM (
  'weekday',
  'weekend',
  'festival'
);

CREATE TYPE amenity_type AS ENUM (
  'free',
  'paid'
);

CREATE TYPE amenity_pricing_type AS ENUM (
  'per_person',
  'per_booking',
  'per_hour'
);

CREATE TYPE amenity_category AS ENUM (
  'accommodation',
  'recreation',
  'catering',
  'entertainment',
  'transport'
);

CREATE TYPE payment_method AS ENUM (
  'cash',
  'upi',
  'bank_transfer',
  'card',
  'cheque',
  'online_gateway',
  'other'
);

CREATE TYPE payment_type AS ENUM (
  'advance',
  'partial',
  'final',
  'refund'
);

CREATE TYPE transaction_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'cancelled'
);