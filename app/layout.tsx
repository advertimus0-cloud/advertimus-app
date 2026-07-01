import "./globals.css";
import "boxicons/css/boxicons.min.css";
import type { Viewport } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
})

// Elegant high-contrast serif for the marketing headline (ITC Benguiat-style feel)
const headingFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
})

export const metadata = {
  title: "Advertimus",
  description: "Advertimus SaaS Platform",
};

// Ensures the viewport is stable on all devices.
// NOTE: we do NOT set maximumScale=1 here — that would disable accessibility zoom.
// iOS auto-zoom is prevented via the font-size ≥ 16px rule in globals.css instead.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${headingFont.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
