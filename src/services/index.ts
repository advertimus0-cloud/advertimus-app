/**
 * Services — Advertimus
 *
 * Purpose: Thin client-side wrappers around backend API routes.
 * These functions call the Next.js API routes in /app/api/** — they do NOT
 * contain business logic or auth enforcement (see AI_SECURITY_RULES.md §5).
 *
 * SECURITY NOTES:
 *  - No API keys or secrets are ever stored or passed from this layer.
 *  - All requests include credentials: 'include' so the httpOnly auth cookie
 *    is forwarded automatically — tokens are never read from client code.
 *  - Every service function validates the HTTP response status before returning
 *    and throws a typed error containing only a generic message (§13 Error Handling).
 *
 * Modules:
 *  - chatService    : send messages, fetch chat history
 *  - projectService : create / update / delete projects
 *  - creditService  : read credit balance
 *  - generateService: trigger video / image generation jobs
 *  - authService    : login, logout (delegates to /api/auth/*)
 */

// Exports will be added here as service modules are implemented.
export {};
