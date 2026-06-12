/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Vercel: keep serverless functions warm longer
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Disable static optimization for API routes
  output: undefined,
};

module.exports = nextConfig;
