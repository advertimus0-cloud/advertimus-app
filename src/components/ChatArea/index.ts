/**
 * src/components/ChatArea/index.ts
 *
 * Purpose: Center panel — the primary user interface.
 * Responsibilities:
 *  - Render conversation message list (user + agent + system messages)
 *  - Message input bar with send button
 *  - Interactive MCQ / step-by-step question cards
 *  - Real-time streaming agent responses
 *  - File / image upload trigger (reference images)
 *
 * SECURITY:
 *  - All user input is trimmed and length-validated before dispatch (§5).
 *  - LLM output is rendered via a safe markdown renderer (DOMPurify + marked),
 *    never via dangerouslySetInnerHTML with raw strings (§7).
 *  - Uploaded files are validated client-side for type/size before upload;
 *    server-side validation is the authoritative check (§8).
 */
export {};
