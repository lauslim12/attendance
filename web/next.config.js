/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return (
      process.env.NODE_ENV === "development" && [
        {
          source: "/api/:path*",
          destination: "http://localhost:8080/api/:path*",
        },
      ]
    );
  },
};

module.exports = nextConfig;
