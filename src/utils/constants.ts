/**
 * Advertising Platform Constants
 * Defines plan limits, credit costs, and API endpoints.
 * SECURITY NOTE: These are for UI/UX conveniences. Actual enforcement MUST happen on the backend.
 */
import { PlanType } from '../types';

export const PLAN_TYPES = {
  LAUNCH: 'LAUNCH' as PlanType,
  GROWTH: 'GROWTH' as PlanType,
  DOMINANCE: 'DOMINANCE' as PlanType,
  ENTERPRISE: 'ENTERPRISE' as PlanType,
};

export const CREDIT_COSTS = {
  IMAGE_AD: 40,
  SOCIAL_POST: 60,
  VIDEO_15: 400,
  VIDEO_20: 450,
  VIDEO_30: 550,
  VIDEO_40: 700,
  VIDEO_50: 1000,
  AD_VARIATION: 20,
};

export const PLAN_LIMITS = {
  LAUNCH: {
    maxVideoLengthSeconds: 30,
    maxReferenceImages: 4,
    activeProjects: 1,
  },
  GROWTH: {
    maxVideoLengthSeconds: 40,
    maxReferenceImages: 12,
    activeProjects: 3,
  },
  DOMINANCE: {
    maxVideoLengthSeconds: 50,
    maxReferenceImages: 12,
    activeProjects: 10,
  },
  ENTERPRISE: {
    maxVideoLengthSeconds: Infinity,
    maxReferenceImages: Infinity,
    activeProjects: Infinity,
  },
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  
  // Projects
  PROJECTS: '/api/projects',
  UPLOAD_REFERENCES: '/api/chat/upload-references',
  
  // Chat & Generation
  CHAT_MESSAGE: '/api/chat/message',
  GENERATE_VIDEO: '/api/generate/video',
  
  // Credits
  CHECK_CREDITS: '/api/credits/check',
};
