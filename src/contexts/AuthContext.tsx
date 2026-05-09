'use client'

import React, { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { User } from '../types';

/**
 * Authentication State Interface
 */
interface AuthProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthState extends AuthProps {
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

type AuthStore = ReturnType<typeof createAuthStore>;

/**
 * Create the actual Zustand store logic
 * SECURITY NOTE: Client-side auth state is strictly for UI rendering logic. 
 * Real API requests must still be validated via secure HttpOnly cookies/headers server-side.
 */
const createAuthStore = (initProps?: Partial<AuthProps>) => {
  const DEFAULT_PROPS: AuthProps = {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Typically true initially until auth check
  };

  return createStore<AuthState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    // Note: These methods only update UI state. 
    // Actual authentication operations (API calls, Supabase sessions) happen outside.
    login: (user: User) => set({ user, isAuthenticated: true, isLoading: false }),
    logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
    setUser: (user: User) => set({ user }),
  }));
};

/**
 * React Context for dependency injection (Next.js SSR compliant)
 */
const AuthContext = createContext<AuthStore | null>(null);

/**
 * Provider Component to isolate store instance per request
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AuthStore>();
  
  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  return (
    <AuthContext.Provider value={storeRef.current}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to consume the Auth Context easily within components
 */
export function useAuthContext<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return useStore(store, selector);
}
