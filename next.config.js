/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic Next.js configuration
  experimental: {
    // Remove any turbo references that might cause issues
  },
  // For Vercel deployment, we don't need static export
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
