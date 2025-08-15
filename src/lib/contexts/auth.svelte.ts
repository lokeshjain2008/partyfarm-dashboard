import { getContext, setContext } from 'svelte';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase.js';
import { getCurrentSession, onAuthStateChange } from '../auth.js';
import type { Database } from '../types/database.js';

type UserRole = Database['public']['Enums']['user_role'];
type UserStatus = Database['public']['Enums']['user_status'];

export interface AuthUser {
  id: string;
  email?: string;
  role?: UserRole;
  organization_id?: string;
  property_access?: string[];
  status?: UserStatus;
  full_name?: string;
  aud: string;
  created_at: string;
  updated_at?: string;
}

const AUTH_CONTEXT_KEY = Symbol('auth');

// Fetch user profile from database
async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role, organization_id, property_access, status, full_name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return {};
    }

    return data || {};
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {};
  }
}

export class AuthContext {
  user = $state<AuthUser | null>(null);
  session = $state<Session | null>(null);
  loading = $state(true);
  initialized = $state(false);

  constructor() {
    this.initialize();
  }

  // Initialize auth state
  async initialize() {
    try {
      this.loading = true;
      
      const { session } = await getCurrentSession();
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        this.user = {
          id: session.user.id,
          email: session.user.email,
          aud: session.user.aud,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at,
          ...userProfile,
        };
        this.session = session;
      } else {
        this.user = null;
        this.session = null;
      }
      
      this.loading = false;
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.user = null;
      this.session = null;
      this.loading = false;
      this.initialized = true;
    }
  }

  // Set auth state
  setAuth(user: AuthUser | null, session: Session | null) {
    this.user = user;
    this.session = session;
    this.loading = false;
    this.initialized = true;
  }

  // Clear auth state
  clearAuth() {
    this.user = null;
    this.session = null;
    this.loading = false;
    this.initialized = true;
  }

  // Derived getters
  get isAuthenticated() {
    return !!this.user && !!this.session;
  }

  get userRole() {
    return this.user?.role || null;
  }

  get userStatus() {
    return this.user?.status || null;
  }

  get isPending() {
    return this.user?.status === 'pending';
  }

  get isActive() {
    return this.user?.status === 'active';
  }

  get isInHouseUser() {
    return this.user?.role?.startsWith('inhouse_') || false;
  }

  get isFarmhouseUser() {
    return this.user?.role?.startsWith('farmhouse_') || false;
  }

  get isAdmin() {
    const role = this.user?.role;
    return role === 'super_admin' || role === 'inhouse_admin' || role === 'farmhouse_admin';
  }

  get isSuperAdmin() {
    return this.user?.role === 'super_admin';
  }
}

export function setAuthContext() {
  const authContext = new AuthContext();
  setContext(AUTH_CONTEXT_KEY, authContext);
  return authContext;
}

export function getAuthContext(): AuthContext {
  const context = getContext<AuthContext>(AUTH_CONTEXT_KEY);
  if (!context) {
    throw new Error('Auth context not found. Make sure to call setAuthContext() in a parent component.');
  }
  return context;
}

// Initialize auth listener
let authListenerInitialized = false;

export function initializeAuthListener(authContext: AuthContext) {
  if (authListenerInitialized) return;
  
  authListenerInitialized = true;
  
  // Listen to auth state changes
  onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.id);
    
    if (event === 'SIGNED_IN' && session?.user) {
      const userProfile = await fetchUserProfile(session.user.id);
      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        aud: session.user.aud,
        created_at: session.user.created_at,
        updated_at: session.user.updated_at,
        ...userProfile,
      };
      
      authContext.setAuth(authUser, session);
    } else if (event === 'SIGNED_OUT') {
      authContext.clearAuth();
    } else if (event === 'TOKEN_REFRESHED' && session?.user) {
      const userProfile = await fetchUserProfile(session.user.id);
      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        aud: session.user.aud,
        created_at: session.user.created_at,
        updated_at: session.user.updated_at,
        ...userProfile,
      };
      
      authContext.setAuth(authUser, session);
    }
  });
}