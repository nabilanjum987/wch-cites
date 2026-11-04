import type { MetadataRoute } from 'next';

// Web app manifest (feat/pin-clock): the plumbing "Add to Home
// Screen" honestly needs — a name, a start URL and real icons
// (public/icons/, drawn for this purpose: the site's gold-ringed
// clock on its own navy). Next serves this at /manifest.webmanifest
// and links it automatically. Note what is NOT here: a service
// worker. The manifest alone satisfies some browsers' install
// prompts; browsers that also demand a service worker fall back to
// the manual steps the pin menu shows, never to a fake prompt.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WorldCityHub: Every City, Live',
    short_name: 'WorldCityHub',
    description:
      'Live weather, prayer times, gold rates, local news and culture for cities across the world.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0e1a',
    theme_color: '#0a0e1a',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
