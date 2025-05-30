
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppClientLayout from '@/components/layout/AppClientLayout'; // Import the new client layout wrapper

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Anointed Star Foundation',
  description: 'Empowering communities and creating brighter futures. Join Anointed Star Foundation in making a difference.',
  icons: {
    // Placeholder for potential future favicon, current guidelines say no favicon.
    // icon: '/favicon.ico',
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
        <AppClientLayout>{children}</AppClientLayout>
      </body>
    </html>
  );
}
