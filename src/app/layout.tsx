
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppClientLayout from '@/components/layout/AppClientLayout';
import { FirebaseClientProvider } from '@/firebase';
import { Analytics } from "@vercel/analytics/next";

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
  description: 'Anointed Foundation is dedicated to empowering individuals and fostering sustainable community development.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Anointed Star Hub',
  },
  openGraph: {
    type: 'website',
    siteName: 'Anointed Star Hub',
    title: 'Anointed Foundation | Empowering Communities',
    description: 'Empowering underserved communities through education, health, and economic development.',
    images: [{ url: '/favicon.ico' }],
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
          <AppClientLayout>
            {children}
            <Analytics />
          </AppClientLayout>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
