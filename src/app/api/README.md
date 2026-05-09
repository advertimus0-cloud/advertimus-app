/**
 * src/app/api/README.md — API Routes (Advertimus)
 *
 * Purpose: All backend Next.js Route Handlers live under this directory.
 * These are the ONLY places where sensitive logic, DB access, and AI calls
 * are performed (AI_SECURITY_RULES.md §5, §16).
 *
 * Planned route structure:
 *
 * /api/
 * ├── auth/
 * │   ├── login/route.ts      — POST: authenticate with Supabase, set httpOnly cookie
 * │   └── logout/route.ts     — POST: invalidate session
 * ├── chat/
 * │   ├── message/route.ts    — POST: send user message → agent pipeline
 * │   └── upload-references/route.ts — POST: upload reference images (validated server-side)
 * ├── generate/
 * │   └── video/route.ts      — POST: trigger n8n video generation webhook
 * ├── credits/
 * │   └── check/route.ts      — GET: return current credit balance for authenticated user
 * └── projects/
 *     └── route.ts            — GET/POST: list and create projects
 *
 * SECURITY REQUIREMENTS FOR EVERY ROUTE (mandatory):
 *  1. Validate session via Supabase `createServerClient` — reject if missing.
 *  2. Validate and sanitize all inputs (type, length, format).
 *  3. Enforce payload size limits.
 *  4. Scope all DB queries to `user_id` AND `workspace_id`.
 *  5. Return generic error messages only — no stack traces or internal paths.
 *  6. Apply rate limiting via Upstash Redis before processing.
 */
