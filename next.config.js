/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HOST: process.env.HOST,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_PROVINSI_DEFAULT: process.env.PROVINSI,
    NEXT_PUBLIC_KABKOTA_DEFAULT: process.env.KABKOTA,
    NEXT_PUBLIC_TYNI_MCE_API: process.env.TYNI_MCE_API,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
