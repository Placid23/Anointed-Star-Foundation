import type { Metadata } from 'next';
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
  title: 'Anointed Foundation',
  description: 'Empowering communities and creating brighter futures. Join Anointed Foundation in making a difference.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  }
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
