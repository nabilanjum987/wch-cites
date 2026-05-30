import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TickerBar from '@/components/shared/TickerBar';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WorldCityHub - Every City, Live Daily Data',
  description: 'Access live daily data for every city on earth - weather, prayer times, news, events, economy and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <TickerBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}