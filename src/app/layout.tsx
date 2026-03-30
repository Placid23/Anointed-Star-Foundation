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
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Anointed Star Hub | Empowering Communities',
  description: 'Anointed Foundation is dedicated to empowering individuals and fostering sustainable community development. Join us in illuminating potential.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://anointed-foundation.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anointed Star Hub',
    description: 'Empowering communities and creating brighter futures.',
    url: '/',
    siteName: 'Anointed Foundation',
    images: [
      {
        url: '/anointed-star-hub-logo.jpg.jpeg',
        width: 800,
        height: 600,
        alt: 'Anointed Foundation Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
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
    apple: '/anointed-star-hub-logo.jpg.jpeg',
  }
};

export const viewport: Viewport = {
  themeColor: '#0A0F1C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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