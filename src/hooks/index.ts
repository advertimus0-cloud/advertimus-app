/**
 * Custom React Hooks — Advertimus
 *
 * Purpose: Encapsulate reusable stateful logic consumed by UI components.
 * All hooks are client-side only; they must NOT perform sensitive operations
 * or call the DB directly (see AI_SECURITY_RULES.md §16 Architecture Enforcement).
 *
 * Hooks exported from this barrel:
 *  - useChat       : manages chat session state and message dispatch
 *  - useCredits    : reads credit balance from CreditContext
 *  - useProject    : reads/writes active project from ProjectContext
 *  - useAuth       : reads authenticated user from AuthContext
 *  - useDebounce   : generic debounce utility hook
 *  - useMediaQuery : responsive breakpoint detection
 */

// Exports will be added here as hooks are implemented.
export {};
