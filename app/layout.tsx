import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WorldCityHub - Explore Every City on Earth',
  description: 'Global city information platform. Weather, prayer times, gold rates, news, and heritage for cities around the world.',
  keywords: 'cities, weather, prayer times, news, gold rates, world cultures',
  openGraph: {
    title: 'WorldCityHub',
    description: 'Your gateway to every city on Earth',
    images: [
      {
        url: 'https://worldcityhub.app/og-image.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://worldcityhub.app/og-image.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`} style={{ backgroundColor: '#0a0f1e' }}>
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
