/** @type {import('next').NextConfig} */
const nextConfig = {
  // Log environment variables during build to help debug
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AI_SERVICE_URL: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
  },
  // Add output configuration for standalone mode (better for Docker)
  output: 'standalone',
}

module.exports = nextConfig
