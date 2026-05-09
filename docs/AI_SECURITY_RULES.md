# AI SECURITY RULES — [YOUR PROJECT] (STRICT MODE)
# Version: 2.0 — Production SaaS Chat Application

This project enforces production-grade security standards.
These rules are NOT optional. Any violation = invalid code.
Stack: Next.js · Supabase · Vercel · AI/LLM backend

---

## 1. TRUST MODEL
- The frontend is ALWAYS untrusted.
- Never trust client-side data, inputs, or logic.
- All security must be enforced in the backend.
- Treat AI/LLM output as untrusted input — sanitize before rendering.

---

## 2. AUTHENTICATION & AUTHORIZATION
- Every request MUST verify the authenticated user via server-side session.
- Never assume authentication from the frontend.
- Enforce strict authorization:
  - Users can ONLY access their own data.
  - Workspace/org members can ONLY access their own workspace.
- Always validate sessions using Supabase Auth server-side (`createServerClient`).
- Short-lived tokens only. Refresh silently. Never store tokens in localStorage.
- Implement account lockout after repeated failed attempts.
- Enforce strong password policy or enforce SSO/OAuth.

---

## 3. MULTI-TENANCY ISOLATION (CRITICAL — CHAT SAAS)
This app serves multiple organizations/workspaces.
- Every resource (chats, messages, files, API keys) MUST be scoped to a `workspace_id`.
- RLS policies MUST enforce BOTH `auth.uid() = user_id` AND `workspace_id` checks.
- Users may belong to multiple workspaces — always verify active workspace membership before access.
- NEVER allow cross-tenant queries. A user in Workspace A must NEVER see data from Workspace B.
- Admin roles are workspace-scoped only. No global admin access unless explicitly required and separately protected.

---

## 4. DATABASE SECURITY (MANDATORY — CRITICAL)
This project uses Supabase.
- Row Level Security (RLS) MUST be enabled on ALL tables. No exceptions.
- Every policy MUST scope by: `auth.uid() = user_id` AND relevant `workspace_id`.
- NEVER allow:
  - Unrestricted SELECT / INSERT / UPDATE / DELETE
  - `USING (true)` or `WITH CHECK (true)` policies
  - Queries using the service role key from client-side code
- All database mutations must go through server actions or API routes — never direct client DB writes for sensitive operations.
- Soft-delete pattern for messages and chat history (see §12 for data retention).
- Cascade delete must be tested: deleting a workspace must wipe all associated user data.

---

## 5. API SECURITY
- All sensitive logic MUST run in backend (API routes / server actions).
- NEVER expose: secrets, API keys, internal logic, user IDs of other users.
- Validate and sanitize ALL inputs (type, length, format, range).
- Protect against: SQL injection, XSS, SSRF, path traversal, malformed JSON, oversized payloads.
- Enforce payload size limits on all endpoints (especially file uploads and message endpoints).
- Use parameterized queries only — never string-concatenated SQL.
- Validate `Content-Type` headers. Reject unexpected types.
- All API routes must return consistent response shapes — never leak internal field names.

---

## 6. REALTIME & WEBSOCKET SECURITY (CHAT-SPECIFIC)
- All realtime subscriptions (Supabase Realtime / WebSocket channels) MUST be authenticated.
- Channel names must NEVER be guessable — scope them to `workspace_id:user_id` or use opaque UUIDs.
- Re-validate authorization on every reconnect, not just initial connect.
- Prevent message replay: include server-generated timestamps and message IDs; reject duplicates.
- Rate-limit messages per connection (not just per IP).
- On user logout or session expiry, immediately close all active realtime channels.
- Never broadcast internal metadata (user IDs, internal room states) to clients.

---

## 7. AI / LLM SECURITY (CRITICAL — AI CHAT APP)
- Sanitize ALL user input before passing to the LLM — strip or escape control characters and injection attempts.
- Implement a system prompt that cannot be overridden by user messages. Enforce this server-side.
- Protect against prompt injection: users must not be able to hijack the system prompt via chat input.
- Sanitize and render ALL LLM output safely — treat it as untrusted HTML. Use a safe markdown renderer (e.g., `marked` with a strict sanitizer like `DOMPurify`). Never use `dangerouslySetInnerHTML` with raw LLM output.
- Enforce per-user and per-workspace token limits to prevent cost abuse.
- Log all LLM requests server-side (prompt hash, token count, latency) without storing raw user content longer than necessary.
- If tool use / function calling is enabled, validate all tool outputs before acting on them.
- Implement content filtering on LLM responses for your use case (e.g., block PII leakage, policy violations).

---

## 8. FILE & MEDIA UPLOAD SECURITY
- Validate MIME type server-side (not just file extension or client-provided Content-Type).
- Enforce file size limits per user, per upload, and per workspace.
- Store files in private Supabase Storage buckets — never public unless explicitly required.
- Generate signed, short-lived URLs for file access — never expose raw storage paths.
- Scan uploaded files for malware if budget allows (or block executable file types entirely).
- Never execute or render user-uploaded files server-side without explicit safe handling.
- Prevent hotlinking: signed URLs must be tied to the authenticated user session.

---

## 9. ENVIRONMENT VARIABLES
- NEVER hardcode secrets.
- NEVER use `NEXT_PUBLIC_` prefix for anything sensitive (service role keys, AI API keys, internal URLs).
- Service role key: server-side ONLY. Never in any client bundle.
- Rotate secrets regularly. Invalidate old secrets immediately on rotation.
- Use separate `.env` files per environment: `.env.local`, `.env.staging`, `.env.production`.
- Audit environment variable usage in CI: fail builds that expose sensitive vars to the client bundle.

---

## 10. SECURITY HEADERS (MANDATORY)
Every response from the application MUST include:
- `Content-Security-Policy` — restrict script/style/media sources. Prevent inline script execution.
- `X-Frame-Options: DENY` — prevent clickjacking.
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — restrict camera, microphone, geolocation unless required.
- Configure in `next.config.js` headers. Verify with securityheaders.com before each major release.

---

## 11. CSRF PROTECTION
- All state-mutating requests (POST, PUT, PATCH, DELETE) must include CSRF protection.
- Use `SameSite=Strict` or `SameSite=Lax` on all auth cookies.
- Validate `Origin` and `Referer` headers on sensitive endpoints.
- For server actions: Next.js handles CSRF automatically only when using the built-in action system — verify this is in use.

---

## 12. RATE LIMITING & ABUSE PROTECTION
- Use a persistent, distributed rate limiter (e.g., Upstash Redis + `@upstash/ratelimit`).
- DO NOT use in-memory solutions (Map, local counters) — stateless on Vercel.
- Apply limits at multiple levels:
  - Per IP (unauthenticated endpoints)
  - Per user (authenticated endpoints)
  - Per workspace (org-level abuse)
  - Per AI model call (token cost protection)
- Implement exponential backoff for repeated violations.
- Alert on anomalous usage patterns (sudden spike in AI calls, bulk data exports).

---

## 13. ERROR HANDLING
- NEVER expose stack traces, internal error codes, file paths, DB query strings, or user data in API responses.
- Return generic, user-friendly error messages only.
- Log full errors securely on the server with a unique error ID.
- Return the error ID to the client only — never the full error.
- Strip error details from HTTP headers (no `X-Powered-By`, no verbose server headers).
- Never log raw user input or message content in error logs.

---

## 14. AUDIT LOGGING & FORENSICS
- Log all security-sensitive actions to an immutable audit log:
  - Login / logout / failed login attempts
  - Workspace member additions/removals
  - Billing and subscription changes
  - Admin actions
  - Data exports or bulk reads
  - API key creation/deletion
- Audit logs must NOT be deletable by end users or workspace admins.
- Include: timestamp, actor user ID, action type, affected resource ID, IP address, user agent.
- Retain audit logs for a minimum of 90 days (or per your compliance requirements).

---

## 15. DATA RETENTION & PRIVACY (GDPR/COMPLIANCE)
- Implement right-to-erasure: deleting an account must cascade-delete all associated data.
- Use soft-delete for messages and chats (mark deleted, purge on schedule).
- Define and enforce data retention windows — do not store data indefinitely without purpose.
- Do not store raw LLM conversation content longer than necessary for product functionality.
- Never log or store PII (email, IP) outside of access-controlled, encrypted storage.
- Have a documented data processing agreement if using third-party AI providers.

---

## 16. ARCHITECTURE ENFORCEMENT
- Strict separation:
  - Frontend = UI + display only
  - Backend = all logic, authorization, AI calls, DB writes
- No sensitive operations in frontend components or client-side hooks.
- All critical operations must go through authenticated, rate-limited backend endpoints.
- Never call Supabase with the service role key from client components.
- AI provider API keys (OpenAI, Anthropic, etc.) must only be used server-side.

---

## 17. CODE STANDARDS
- Code must be clean, maintainable, and production-ready.
- Avoid shortcuts, hacks, or insecure patterns.
- Always prioritize security over convenience.
- All dependencies must be pinned. Run `npm audit` in CI — fail on high/critical.
- Do not use `eval()`, `new Function()`, or dynamic `require()` with user input.

---

## 18. OUTPUT REQUIREMENTS (MANDATORY)
When generating code, the AI MUST:
1. Briefly explain security decisions made.
2. Highlight how data is protected and isolated.
3. State how authentication and authorization are enforced.
4. Explicitly warn if any part is potentially insecure or requires additional review.
5. Flag any third-party dependency being introduced and note any security implications.

---

## FINAL RULE
If any of the above rules are violated,
the output is considered INVALID and must be corrected immediately.
Security is non-negotiable. When in doubt, reject and ask.
