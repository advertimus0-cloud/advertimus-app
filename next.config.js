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
          // Control referrer info
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy — disable unused browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
