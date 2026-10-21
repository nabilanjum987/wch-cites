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
  return (
    <>
      <MyLocationPage />
      {/* Server-rendered explainer: the interactive app above needs the
          browser's location permission, so this static section gives the
          raw HTML (and anyone who declines permission) the page's real
          content — what it does, the privacy promise, and what to do
          without sharing a location. No data is claimed here. */}
      <section className="bg-[#0a0e1a] text-white px-6 pb-16">
        <div className="max-w-5xl mx-auto space-y-6 text-white/60 leading-relaxed">
          <h2 className="text-2xl font-bold text-white">How My Location works</h2>
          <p>
            When you allow location access, this page fills itself in for the place you are
            standing in: current weather and the week ahead, today&apos;s prayer times for your
            coordinates, live gold and currency rates for your country, and the emergency phone
            numbers that apply where you are. Everything is computed from your position at the
            moment you open the page.
          </p>
          <h2 className="text-2xl font-bold text-white">Your location is never stored or sold</h2>
          <p>
            WorldCityHub does not save your location to a server, does not build a history of
            where you have been, and never sells location data. The position your browser shares
            is used once, on this page, to fetch the weather, prayer and rate data for that spot —
            then it is gone. Declining the permission prompt changes nothing about your privacy:
            the page simply stays in its manual mode.
          </p>
          <h2 className="text-2xl font-bold text-white">Prefer not to share?</h2>
          <p>
            You can get the same information by opening any city page directly — every city on
            WorldCityHub carries its own weather, prayer times, rates, news and events. Start
            from the countries index or search for your city from the homepage, and the data is
            identical, just chosen by hand instead of by GPS.
          </p>
        </div>
      </section>
    </>
  );
}
