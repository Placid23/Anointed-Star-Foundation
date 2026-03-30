import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppClientLayout from '@/components/layout/AppClientLayout';
import { FirebaseClientProvider } from '@/firebase';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist_mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Anointed Star Hub | Empowering Communities',
    template: '%s | Anointed Star Hub',
  },
  description: 'Anointed Foundation is dedicated to empowering individuals and fostering sustainable community development. Join us in illuminating potential and promoting happiness.',
  keywords: ['Anointed Foundation', 'Star Hub', 'Community Development', 'Charity', 'Empowerment', 'Education', 'Health Initiative'],
  authors: [{ name: 'Anointed Foundation' }],
  creator: 'Anointed Foundation',
  manifest: '/manifest.json',
  metadataBase: new URL('https://anointed-foundation.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anointed Star Hub | Empowering Communities',
    description: 'Join Anointed Foundation in our mission to illuminate potential and foster sustainable community growth.',
    url: 'https://anointed-foundation.vercel.app',
    siteName: 'Anointed Star Hub',
    images: [
      {
        url: '/anointed-star-hub-logo.jpg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Anointed Foundation - Illuminating Happiness',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anointed Star Hub | Empowering Communities',
    description: 'Empowering individuals and fostering sustainable community development.',
    images: ['/anointed-star-hub-logo.jpg.jpeg'],
    creator: '@anointedfound',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Anointed Star Hub',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/anointed-star-hub-logo.jpg.jpeg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0F1C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans flex flex-col min-h-screen bg-background`}>
        <FirebaseClientProvider>
          <AppClientLayout>{children}</AppClientLayout>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
