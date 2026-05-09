/**
 * src/contexts/index.ts — React Context Barrel (Advertimus)
 *
 * Purpose: Re-exports all context providers and their associated hooks so
 * components can import from a single location.
 *
 * Contexts:
 *  - AuthContext    : authenticated user session (read-only on client)
 *  - CreditContext  : user's credit balance and plan type
 *  - ProjectContext : active project / conversation state
 *  - ChatContext    : message list, sending state, streaming flag
 *
 * SECURITY (AI_SECURITY_RULES.md §16):
 *  - Context values are populated from server-fetched, sanitized data.
 *  - No raw Supabase client tokens or service-role keys ever appear in context.
 *  - Sensitive fields (e.g. raw email) are excluded from context values where
 *    not needed by UI — principle of least privilege.
 */

export { AuthContext, AuthProvider } from './AuthContext';
export { CreditContext, CreditProvider } from './CreditContext';
export { ProjectContext, ProjectProvider } from './ProjectContext';
