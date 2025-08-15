-- RLS Policies for Users Table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can view users based on their scope
CREATE POLICY "Admins can view scoped users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('super_admin', 'inhouse_admin', 'farmhouse_admin')
      AND (
        u.role IN ('super_admin', 'inhouse_admin') OR -- Global access
        u.organization_id = organization_id -- Organization scope
      )
    )
  );

-- Admins can insert users in their scope
CREATE POLICY "Admins can create scoped users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('super_admin', 'inhouse_admin', 'farmhouse_admin')
      AND (
        u.role IN ('super_admin', 'inhouse_admin') OR -- Global access
        u.organization_id = organization_id -- Organization scope
      )
    )
  );

-- Admins can update users in their scope
CREATE POLICY "Admins can update scoped users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('super_admin', 'inhouse_admin', 'farmhouse_admin')
      AND (
        u.role IN ('super_admin', 'inhouse_admin') OR -- Global access
        u.organization_id = organization_id -- Organization scope
      )
    )
  );

-- RLS Policies for Organizations Table
-- Super admins and inhouse admins can manage organizations
CREATE POLICY "Admins can manage organizations" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('super_admin', 'inhouse_admin')
    )
  );

-- Users can view their own organization
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.organization_id = id
    )
  );

-- RLS Policies for Properties Table
-- Property owners can manage their properties
CREATE POLICY "Owners can manage properties" ON properties
  FOR ALL USING (owner_id = auth.uid());

-- Users can view properties based on their role scope
CREATE POLICY "Users can view scoped properties" ON properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND (
        u.role IN ('inhouse_admin', 'inhouse_manager', 'inhouse_viewer') OR -- In-house users see all
        (u.role IN ('farmhouse_owner', 'farmhouse_admin', 'farmhouse_staff') AND u.organization_id = (
          SELECT organization_id FROM users WHERE id = owner_id
        )) OR -- Organization users see org properties
        (u.property_access @> ARRAY[id]) -- Property users see assigned properties
      )
    )
  );

-- In-house users can create properties
CREATE POLICY "Inhouse users can create properties" ON properties
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('inhouse_admin', 'inhouse_manager')
    )
  );

-- RLS Policies for Bookings Table
-- Property owners can view bookings for their properties
CREATE POLICY "Owners can view property bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties p 
      WHERE p.id = property_id 
      AND p.owner_id = auth.uid()
    )
  );

-- In-house users can manage all bookings
CREATE POLICY "Inhouse users can manage bookings" ON bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('inhouse_admin', 'inhouse_manager')
    )
  );

-- Property owners can update bookings for their properties
CREATE POLICY "Owners can update property bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties p 
      WHERE p.id = property_id 
      AND p.owner_id = auth.uid()
    )
  );

-- RLS Policies for Payment Transactions Table
-- Users can view payment transactions for bookings they can access
CREATE POLICY "Users can view accessible payment transactions" ON payment_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users u ON u.id = auth.uid()
      WHERE b.id = booking_id
      AND (
        u.role IN ('inhouse_admin', 'inhouse_manager', 'inhouse_viewer') OR -- In-house users see all
        p.owner_id = auth.uid() OR -- Property owners see their bookings
        (u.role IN ('farmhouse_owner', 'farmhouse_admin', 'farmhouse_staff') AND u.organization_id = (
          SELECT organization_id FROM users WHERE id = p.owner_id
        )) -- Organization users see org bookings
      )
    )
  );

-- Users can create payment transactions for bookings they can manage
CREATE POLICY "Users can create payment transactions" ON payment_transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users u ON u.id = auth.uid()
      WHERE b.id = booking_id
      AND (
        u.role IN ('inhouse_admin', 'inhouse_manager') OR -- In-house users can create for all
        p.owner_id = auth.uid() OR -- Property owners can create for their bookings
        (u.role IN ('farmhouse_owner', 'farmhouse_admin', 'farmhouse_staff') AND u.organization_id = (
          SELECT organization_id FROM users WHERE id = p.owner_id
        )) -- Organization users can create for org bookings
      )
    )
  );

-- RLS Policies for Availability Table
-- Property owners can manage availability for their properties
CREATE POLICY "Owners can manage property availability" ON availability
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties p 
      WHERE p.id = property_id 
      AND p.owner_id = auth.uid()
    )
  );

-- Users can view availability based on property access
CREATE POLICY "Users can view property availability" ON availability
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties p
      JOIN users u ON u.id = auth.uid()
      WHERE p.id = property_id
      AND (
        u.role IN ('inhouse_admin', 'inhouse_manager', 'inhouse_viewer') OR -- In-house users see all
        p.owner_id = auth.uid() OR -- Property owners see their availability
        (u.role IN ('farmhouse_owner', 'farmhouse_admin', 'farmhouse_staff') AND u.organization_id = (
          SELECT organization_id FROM users WHERE id = p.owner_id
        )) OR -- Organization users see org availability
        (u.property_access @> ARRAY[p.id]) -- Property users see assigned availability
      )
    )
  );

-- In-house users can create availability records
CREATE POLICY "Inhouse users can create availability" ON availability
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('inhouse_admin', 'inhouse_manager')
    )
  );