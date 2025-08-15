import { writable, derived, type Readable } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase.js';
import { getCurrentSession, getCurrentUser, onAuthStateChange } from '../auth.js';
import type { Database } from '../types/database.js';

type UserRole = Database['public']['Enums']['user_role'];
type UserStatus = Database['public']['Enums']['user_status'];

export interface AuthUser extends User {
  role?: UserRole;
  organization_id?: string;
  property_access?: string[];
  status?: UserStatus;
  full_name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

// Create the auth store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });

  return {
    subscribe,
    
    // Initialize auth state
    async initialize() {
      try {
        update(state => ({ ...state, loading: true }));
        
        const { session } = await getCurrentSession();
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          const authUser: AuthUser = {
            ...session.user,
            ...userProfile,
          };
          
          set({
            user: authUser,
            session,
            loading: false,
            initialized: true,
          });
        } else {
          set({
            user: null,
            session: null,
            loading: false,
            initialized: true,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        set({
          user: null,
          session: null,
          loading: false,
          initialized: true,
        });
      }
    },

    // Set auth state
    setAuth(user: AuthUser | null, session: Session | null) {
      set({
        user,
        session,
        loading: false,
        initialized: true,
      });
    },

    // Clear auth state
    clearAuth() {
      set({
        user: null,
        session: null,
        loading: false,
        initialized: true,
      });
    },

    // Set loading state
    setLoading(loading: boolean) {
      update(state => ({ ...state, loading }));
    },
  };
}

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

export const authStore = createAuthStore();

// Derived stores for convenience
export const user: Readable<AuthUser | null> = derived(
  authStore,
  $auth => $auth.user
);

export const session: Readable<Session | null> = derived(
  authStore,
  $auth => $auth.session
);

export const isAuthenticated: Readable<boolean> = derived(
  authStore,
  $auth => !!$auth.user && !!$auth.session
);

export const isLoading: Readable<boolean> = derived(
  authStore,
  $auth => $auth.loading
);

export const userRole: Readable<UserRole | null> = derived(
  user,
  $user => $user?.role || null
);

export const userStatus: Readable<UserStatus | null> = derived(
  user,
  $user => $user?.status || null
);

export const isPending: Readable<boolean> = derived(
  userStatus,
  $status => $status === 'pending'
);

export const isActive: Readable<boolean> = derived(
  userStatus,
  $status => $status === 'active'
);

// Role-based access helpers
export const isInHouseUser: Readable<boolean> = derived(
  userRole,
  $role => $role?.startsWith('inhouse_') || false
);

export const isFarmhouseUser: Readable<boolean> = derived(
  userRole,
  $role => $role?.startsWith('farmhouse_') || false
);

export const isAdmin: Readable<boolean> = derived(
  userRole,
  $role => $role === 'super_admin' || $role === 'inhouse_admin' || $role === 'farmhouse_admin'
);

export const isSuperAdmin: Readable<boolean> = derived(
  userRole,
  $role => $role === 'super_admin'
);

// Initialize auth listener
let authListenerInitialized = false;

export function initializeAuthListener() {
  if (authListenerInitialized) return;
  
  authListenerInitialized = true;
  
  // Listen to auth state changes
  onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.id);
    
    if (event === 'SIGNED_IN' && session?.user) {
      const userProfile = await fetchUserProfile(session.user.id);
      const authUser: AuthUser = {
        ...session.user,
        ...userProfile,
      };
      
      authStore.setAuth(authUser, session);
    } else if (event === 'SIGNED_OUT') {
      authStore.clearAuth();
    } else if (event === 'TOKEN_REFRESHED' && session?.user) {
      const userProfile = await fetchUserProfile(session.user.id);
      const authUser: AuthUser = {
        ...session.user,
        ...userProfile,
      };
      
      authStore.setAuth(authUser, session);
    }
  });
}