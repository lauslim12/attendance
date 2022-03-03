const nextSafe = require('next-safe');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Proxy to back-end in development mode.
  async rewrites() {
    return process.env.NGINX
      ? []
      : [
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
            // Allowing `'unsafe-inline'` in `style-src` in production is not a security issue.
            // Only allow from Google Fonts and styles injected from Emotion.
            contentSecurityPolicy: {
              'style-src': ["'self'", "'unsafe-inline'"],
            },

            // `Permissions-Policy` CSP is still experimental.
            permissionsPolicy: false,

            // Development mode.
            isDev: process.env.NODE_ENV !== 'production',

            // Do not enable XSS protection if CSP is active.
            // https://stackoverflow.com/questions/9090577/what-is-the-http-header-x-xss-protection/57802070#57802070.
            // https://owasp.org/www-project-secure-headers/#x-xss-protection.
            xssProtection: '0',
          }),
        ],
      },
    ];
  },

  // Disable `X-Powered-By` header.
  poweredByHeader: false,

  // Enable minification.
  swcMinify: true,

  // Enable React Strict Mode.
  reactStrictMode: true,
};

module.exports = nextConfig;
