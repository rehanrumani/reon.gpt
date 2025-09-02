/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    // ✅ Prevent build from failing due to lint errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
