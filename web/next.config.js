const nextSafe = require('next-safe');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Proxy to back-end in development mode.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },

  // Inject secure headers like Helmet.
  // https://nextjs.org/docs/advanced-features/security-headers.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Send app codename.
          {
            key: 'X-Attendance-Web',
            value: 'Azami',
          },

          // Send app version number.
          {
            key: 'X-Attendance-Web-Version',
            value: process.env.npm_package_version,
          },

          // Allow prefetching.
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },

          // Handle secure headers: `Content-Security-Policy`, `Referrer-Policy`,
          // `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection`.
          ...nextSafe({
            // Only allow from Google Fonts.
            contentSecurityPolicy: {
              'font-src': ["'self'", 'fonts.gstatic.com'],
              'style-src': ["'self'", 'fonts.googleapis.com'],
            },

            // `Permissions-Policy` CSP is still experimental.
            permissionsPolicy: false,

            // Development mode.
            isDev: process.env.NODE_ENV,
          }),
        ],
      },
    ];
  },

  // Enable minification.
  swcMinify: true,

  // Enable React Strict Mode.
  reactStrictMode: true,
};

module.exports = nextConfig;
