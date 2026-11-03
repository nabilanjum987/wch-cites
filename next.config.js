/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    // R10: serve AVIF/WebP from the image optimizer where next/image is used.
    formats: ['image/avif', 'image/webp'],
  },
  // Speed pass (2026-11-03): files under /public/images are content
  // pictures (photos, flags, cards). Browsers were revalidating them
  // on every visit (Vercel's default for /public is effectively
  // no-cache). A 7-day browser cache with a day of
  // stale-while-revalidate makes repeat visits paint instantly.
  // Deliberately NOT immutable / 1-year: card photos are sometimes
  // replaced in place under the same filename (e.g. a better licensed
  // shot for the same card), and an immutable year-long cache would
  // keep serving the old picture after such an update.
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

