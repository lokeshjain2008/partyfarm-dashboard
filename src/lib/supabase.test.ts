import { describe, it, expect } from 'vitest';
import { supabase } from './supabase.js';

describe('Supabase Client', () => {
  it('should be properly configured', () => {
    expect(supabase).toBeDefined();
    expect(supabase.supabaseUrl).toBeDefined();
    expect(supabase.supabaseKey).toBeDefined();
  });

  it('should connect to database', async () => {
    // Test basic connection by checking if we can query the users table
    // This will fail if RLS is not properly configured or if there's no connection
    const { error } = await supabase.from('users').select('count').limit(0);
    
    // We expect either success or a specific RLS error (which means connection works)
    if (error) {
      // RLS error is expected when not authenticated
      expect(error.message).toContain('row-level security');
    }
  });
});