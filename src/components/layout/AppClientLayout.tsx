
'use client'; // This component handles client-side logic

import { useState, useEffect, type ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Preloader from '@/components/shared/Preloader';

export default function AppClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time. For a real app, you might tie this to
    // actual data fetching or router events.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); // Preloader will be visible for 2.8 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <Preloader visible={isLoading} />
      <AuthProvider>
        <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500 ease-in-out flex flex-col min-h-screen'}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </>
  );
}
