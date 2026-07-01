/** @type {import('next').NextConfig} */

// ============================================================
// ADVERTISMUS — Next.js Configuration
// ============================================================
// Configures image optimization (sharp), security headers,
// and environment variable exposure for the client.
// ============================================================

const nextConfig = {
  // Enable React strict mode for catching common bugs early
  reactStrictMode: true,

  // Strip the verbose `X-Powered-By: Next.js` header (§13 — don't leak stack details)
  poweredByHeader: false,

  // Image optimization via sharp
  images: {
    // Allow images from these external domains (add more as needed)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.openai.com',
      },
    ],
  },

  // Custom security headers for all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Force HTTPS for 2 years incl. subdomains (§10 — mandatory)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Control referrer info
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy — disable unused browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy — restrict script/style/connect sources.
          // 'unsafe-inline'/'unsafe-eval' on script-src are required by Next.js's
          // own hydration runtime; everything else is locked to self + Supabase.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
