-- Seed data for development and testing

-- Insert test organizations
INSERT INTO organizations (id, name, type, contact_details) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'PartyFarm In-House', 'inhouse', '{"email": "admin@partyfarm.com", "phone": "+91-9876543210"}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Green Valley Farms', 'farmhouse', '{"email": "owner@greenvalley.com", "phone": "+91-9876543211"}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Sunset Farmhouse', 'farmhouse', '{"email": "contact@sunsetfarm.com", "phone": "+91-9876543212"}');

-- Insert test users
INSERT INTO users (id, email, full_name, role, organization_id, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'admin@partyfarm.com', 'System Administrator', 'super_admin', '550e8400-e29b-41d4-a716-446655440001', 'active'),
  ('550e8400-e29b-41d4-a716-446655440012', 'manager@partyfarm.com', 'Booking Manager', 'inhouse_manager', '550e8400-e29b-41d4-a716-446655440001', 'active'),
  ('550e8400-e29b-41d4-a716-446655440013', 'owner@greenvalley.com', 'Green Valley Owner', 'farmhouse_owner', '550e8400-e29b-41d4-a716-446655440002', 'active'),
  ('550e8400-e29b-41d4-a716-446655440014', 'contact@sunsetfarm.com', 'Sunset Farm Owner', 'farmhouse_owner', '550e8400-e29b-41d4-a716-446655440003', 'active');

-- Insert test properties
INSERT INTO properties (id, name, description, owner_id, category, capacity, location, amenities, images, pricing_config, status) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440021',
    'Green Valley Farmhouse',
    'Beautiful farmhouse with scenic views and modern amenities',
    '550e8400-e29b-41d4-a716-446655440013',
    'farmhouse',
    50,
    '{"address": "Village Road, Green Valley", "city": "Pune", "state": "Maharashtra", "coordinates": {"lat": 18.5204, "lng": 73.8567}}',
    '[
      {"id": "1", "name": "Swimming Pool", "type": "free", "category": "recreation"},
      {"id": "2", "name": "DJ Setup", "type": "paid", "price": 5000, "pricing_type": "per_booking", "category": "entertainment"},
      {"id": "3", "name": "Catering Service", "type": "paid", "price": 500, "pricing_type": "per_person", "category": "catering"}
    ]',
    ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    '{
      "pricing_type": "tiered",
      "weekday_tiers": [
        {"guest_range": {"min": 1, "max": 25}, "price": 15000},
        {"guest_range": {"min": 26, "max": 50}, "price": 20000}
      ],
      "weekend_tiers": [
        {"guest_range": {"min": 1, "max": 25}, "price": 20000},
        {"guest_range": {"min": 26, "max": 50}, "price": 25000}
      ],
      "festival_tiers": [
        {"guest_range": {"min": 1, "max": 25}, "price": 25000},
        {"guest_range": {"min": 26, "max": 50}, "price": 30000}
      ]
    }',
    'active'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440022',
    'Sunset Banquet Hall',
    'Elegant banquet hall perfect for weddings and corporate events',
    '550e8400-e29b-41d4-a716-446655440014',
    'banquet_hall',
    100,
    '{"address": "Main Street, Sunset Complex", "city": "Mumbai", "state": "Maharashtra", "coordinates": {"lat": 19.0760, "lng": 72.8777}}',
    '[
      {"id": "1", "name": "Air Conditioning", "type": "free", "category": "accommodation"},
      {"id": "2", "name": "Sound System", "type": "free", "category": "entertainment"},
      {"id": "3", "name": "Decoration Package", "type": "paid", "price": 10000, "pricing_type": "per_booking", "category": "entertainment"}
    ]',
    ARRAY['https://example.com/hall1.jpg', 'https://example.com/hall2.jpg'],
    '{
      "pricing_type": "flat",
      "flat_rates": {
        "weekday": 25000,
        "weekend": 35000,
        "festival": 45000
      }
    }',
    'active'
  );

-- Insert test availability (next 30 days)
INSERT INTO availability (property_id, date, is_available, pricing)
SELECT 
  p.id,
  date_series.date,
  CASE WHEN random() > 0.1 THEN true ELSE false END, -- 90% availability
  CASE 
    WHEN EXTRACT(dow FROM date_series.date) IN (0, 6) THEN 25000 -- Weekend
    ELSE 20000 -- Weekday
  END
FROM properties p
CROSS JOIN (
  SELECT (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 29))::date as date
) date_series
WHERE p.id IN ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440022');

-- Insert test booking
INSERT INTO bookings (id, property_id, customer_details, booking_dates, selected_amenities, status, pricing, payment_info, created_by) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440021',
    '{
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91-9876543220",
      "event_type": "Birthday Party",
      "guest_count": 30
    }',
    '{
      "start_date": "2024-12-15",
      "end_date": "2024-12-15",
      "duration_type": "daily"
    }',
    '[
      {
        "amenity_id": "2",
        "amenity_name": "DJ Setup",
        "quantity": 1,
        "price_per_unit": 5000,
        "total_price": 5000
      },
      {
        "amenity_id": "3",
        "amenity_name": "Catering Service",
        "quantity": 30,
        "price_per_unit": 500,
        "total_price": 15000
      }
    ]',
    'confirmed',
    '{
      "base_amount": 20000,
      "amenities_total": 20000,
      "total_amount": 40000,
      "pricing_breakdown": [
        {
          "date": "2024-12-15",
          "guest_count": 30,
          "rate_applied": 20000,
          "day_type": "weekend"
        }
      ]
    }',
    '{
      "total_amount": 40000,
      "paid_amount": 15000,
      "pending_amount": 25000,
      "advance_required": 15000,
      "advance_percentage": 37.5,
      "payment_schedule": {
        "advance_amount": 15000,
        "advance_due_date": "2024-12-01",
        "final_amount": 25000,
        "final_due_date": "2024-12-15"
      },
      "transactions": []
    }',
    '550e8400-e29b-41d4-a716-446655440012'
  );

-- Insert test payment transaction
INSERT INTO payment_transactions (id, booking_id, amount, payment_method, payment_type, transaction_status, payment_date, recorded_by, notes) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440041',
    '550e8400-e29b-41d4-a716-446655440031',
    15000.00,
    'upi',
    'advance',
    'completed',
    '2024-11-01 10:30:00+00',
    '550e8400-e29b-41d4-a716-446655440012',
    'Advance payment received via UPI'
  );