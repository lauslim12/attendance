/** @type {import('next').NextConfig} */
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
          {
            key: 'X-Attendance-Web',
            value: 'Azami',
          },
          {
            key: 'X-Attendance-Web-Version',
            value: process.env.npm_package_version.toString(),
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
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
