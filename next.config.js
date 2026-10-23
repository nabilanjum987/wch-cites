/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    // R10: serve AVIF/WebP from the image optimizer where next/image is used.
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig

