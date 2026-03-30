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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('SW registered:', registration);
        }).catch((err) => {
          console.warn('SW registration failed:', err);
        });
      });
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); 

    return () => clearTimeout(timer); 
  }, []); 

  // Critical: Prevent rendering children until mounted to avoid hydration errors
  if (!mounted) {
    return <div className="min-h-screen bg-[#0A0F1C]" />;
  }

  return (
    <AuthProvider>
      <Preloader visible={isLoading} />
      <div 
        className={`flex flex-col min-h-screen bg-background transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={isLoading}
      >
        {!isLoading && (
          <>
            <Header />
            <main className="flex-grow pt-16 lg:pt-20">
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
          </>
        )}
      </div>
    </AuthProvider>
  );
}