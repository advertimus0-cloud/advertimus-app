/**
 * src/app/page.tsx — Home Page (Advertimus)
 *
 * Purpose: Entry point for the application.
 * Redirects authenticated users to the dashboard; unauthenticated users see
 * the marketing landing page.
 *
 * SECURITY NOTE: Auth check is performed server-side only (§2, §16).
 * No credentials are exposed to the client.
 */

export default function HomePage() {
  return null; // Redirect logic will be implemented with Supabase server client.
}
