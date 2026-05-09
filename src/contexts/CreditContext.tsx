'use client'

import React, { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { PlanType } from '../types';
import { PLAN_TYPES } from '../utils/constants';

/**
 * Credit State Interface
 */
interface CreditProps {
  creditsRemaining: number;
  creditsUsed: number;
  planType: PlanType;
}

interface CreditState extends CreditProps {
  initializeCredits: (remaining: number, used: number, plan: PlanType) => void;
  checkHasEnoughCredits: (amount: number) => boolean;
  deductCredits: (amount: number) => void;
}

type CreditStore = ReturnType<typeof createCreditStore>;

/**
 * Create the actual Zustand store logic for Credits
 * SECURITY NOTE: This context facilitates predictive UI flows and optimisitic updates.
 * THE BACKEND MUST STRICTLY VERIFY the user's actual credits before passing data to n8n.
 * Never trust client calculations for final billing/credit usage.
 */
const createCreditStore = (initProps?: Partial<CreditProps>) => {
  const DEFAULT_PROPS: CreditProps = {
    creditsRemaining: 0,
    creditsUsed: 0,
    planType: PLAN_TYPES.LAUNCH,
  };

  return createStore<CreditState>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    
    // Syncs client data with server truth 
    initializeCredits: (remaining: number, used: number, plan: PlanType) => 
      set({ creditsRemaining: remaining, creditsUsed: used, planType: plan }),
    
    // Used to gate UI components (e.g., disable 'Start Generating' button)
    checkHasEnoughCredits: (amount: number) => {
      const state = get();
      return state.creditsRemaining >= amount;
    },
    
    // Optimistic UI update when generation starts
    deductCredits: (amount: number) => set((state) => {
      if (state.creditsRemaining < amount) {
        return state; // Prevent negative credits locally; server handles strict rejection
      }
      return {
        creditsRemaining: state.creditsRemaining - amount,
        creditsUsed: state.creditsUsed + amount
      };
    }),
  }));
};

/**
 * React Context for dependency injection
 */
const CreditContext = createContext<CreditStore | null>(null);

/**
 * Provider Component to isolate store instance per request
 */
export function CreditProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<CreditStore>();

  if (!storeRef.current) {
    storeRef.current = createCreditStore();
  }

  return (
    <CreditContext.Provider value={storeRef.current}>
      {children}
    </CreditContext.Provider>
  );
}

/**
 * Custom hook to consume the Credit Context
 */
export function useCreditContext<T>(selector: (state: CreditState) => T): T {
  const store = useContext(CreditContext);
  if (!store) {
    throw new Error('useCreditContext must be used within a CreditProvider');
  }
  return useStore(store, selector);
}
