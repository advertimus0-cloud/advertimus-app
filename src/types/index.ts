/**
 * Core Type Definitions for Advertimus
 * These types match the technical specifications in ADVERTIMUS_TECHNICAL_PLAN_V2.md
 */

// User Type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  planId: PlanType;
  createdAt: string;
}

// Project Type
export interface Project {
  id: string;
  userId: string;
  name: string;
  referenceImages: string[];
  createdAt: string;
  updatedAt: string;
}

// Chat Message Type
export interface Message {
  id: string;
  projectId: string;
  role: 'user' | 'agent' | 'system' | 'interactive';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>; // Used for MCQ options, status updates, etc.
}

// Generated Content Type
export interface GeneratedContent {
  id: string;
  projectId: string;
  videoUrl?: string;
  imageUrls?: string[];
  designUrls?: string[];
  marketingCopy?: {
    strategy?: string;
    headlines?: string[];
    captions?: string[];
    cta?: string[];
  };
  performanceScore?: {
    overall: number;
    visualAppeal: number;
    messageClarity: number;
    audienceAlignment: number;
    callToAction: number;
  };
  createdAt: string;
}

// Credit Balance Type — represents current state of a user's credit account
export interface Credit {
  userId: string;
  remaining: number;
  used: number;
  planType: PlanType;
  updatedAt: string;
}

// Credit Transaction Type
export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // positive for addition, negative for deduction
  description: string;
  createdAt: string;
}

export type PlanType = 'LAUNCH' | 'GROWTH' | 'DOMINANCE' | 'ENTERPRISE';
