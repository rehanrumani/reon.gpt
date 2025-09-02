/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    // ✅ Allow production builds to succeed even if ESLint has warnings/errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
