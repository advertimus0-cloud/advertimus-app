/**
 * src/app/layout.tsx — Root Layout (Advertimus)
 *
 * Purpose: Wraps every page with the global providers, security headers
 * (enforced via next.config.js), and the design-system CSS.
 *
 * SECURITY NOTES (AI_SECURITY_RULES.md §10, §16):
 *  - Security headers (CSP, HSTS, X-Frame-Options, etc.) are declared in
 *    next.config.js — not inline — to prevent client-bundle leakage.
 *  - Context providers that access Supabase use `createServerClient` on the
 *    server side; client components receive only sanitized, minimal data.
 *  - No sensitive environment variables are passed to client components here.
 */

import type { Metadata } from 'next';
import '../../styles/globals.css';

export const metadata: Metadata = {
  title: 'Advertimus',
  description: 'AI-powered marketing assistant — generate ads, videos, and campaigns through natural conversation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
