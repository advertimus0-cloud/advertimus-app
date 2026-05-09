/**
 * src/components/ResultsPanel/index.ts
 *
 * Purpose: Right-side panel — appears ONLY after generation begins.
 * Responsibilities:
 *  - Video player for generated ad videos
 *  - Image gallery for generated ad creatives
 *  - Marketing copy display (headlines, captions, CTAs)
 *  - Performance score visualisation
 *  - Download / export actions
 *
 * BEHAVIOR (per ADVERTIMUS_CHAT_UI_IMPLEMENTATION_GUIDE.md):
 *  - Hidden by default; revealed when generation state becomes active.
 *  - Driven entirely by GeneratedContent passed via props / context.
 *
 * SECURITY:
 *  - Media URLs are signed, short-lived Supabase Storage URLs (§8).
 *  - Download links invoke a backend endpoint that validates the user's
 *    ownership of the asset before issuing a signed URL (§2, §16).
 */
export {};
