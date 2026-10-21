import type { Metadata } from 'next';
import MyLocationPage from './MyLocationClient';

// Server wrapper: the interactive My Location page lives in
// MyLocationClient.tsx. Static metadata lives here. Per the locked spec,
// the visitor's location is used only to fill this page — never stored,
// never sold — and the description says so.

export const metadata: Metadata = {
  title: 'My Location — Weather, Prayer Times & More | WorldCityHub',
  description:
    'Your location, privately: live weather, prayer times, rates and emergency contacts for where you are. Your location is never stored or sold.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/my-location' },
  openGraph: {
    title: 'My Location — Weather, Prayer Times & More | WorldCityHub',
    description:
      'Live weather, prayer times, rates and emergency contacts for where you are — location never stored or sold.',
    url: 'https://worldcityhub.vercel.app/my-location',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

export default function Page() {
  return <MyLocationPage />;
}
