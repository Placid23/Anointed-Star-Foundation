
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Preloader from '@/components/shared/Preloader';
import CookieConsent from '@/components/shared/CookieConsent';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AppClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Increased duration for a more premium feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); 

    return () => clearTimeout(timer); 
  }, []); 

  return (
    <>
      <Preloader visible={isLoading} />
      <AuthProvider>
        <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-700 ease-in-out flex flex-col min-h-screen bg-background'}>
          <Header />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="page-transition-wrapper"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
          <Toaster />
          <CookieConsent />
        </div>
      </AuthProvider>
    </>
  );
}
