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

/**
 * @fileOverview AppClientLayout handles the core client-side wrapper logic.
 * It manages the initial application preloader, ensures hydration stability,
 * and handles page-to-page transitions using Framer Motion.
 */
export default function AppClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Flag that the component has mounted on the client
    setMounted(true);
    
    // Register Service Worker for PWA after load to ensure smooth initial paint
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service Worker registration skipped or failed:', err);
        });
      });
    }

    // Minimum delay for the premium preloader experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); 

    return () => clearTimeout(timer); 
  }, []); 

  // Critical: Prevent hydration mismatch errors by matching initial server-side HTML.
  // We return a themed placeholder div that matches the background color (#0A0F1C).
  if (!mounted) {
    return <div className="min-h-screen bg-[#0A0F1C]" />;
  }

  return (
    <AuthProvider>
      {/* The Preloader handles its own entry/exit animations via its internal visible prop */}
      <Preloader visible={isLoading} />
      
      {/* 
        The main app wrapper. We keep it in the DOM but use Framer Motion 
        to fade it in once the splash screen is finished. initial={false} on the
        inner AnimatePresence ensures the first page doesn't "double animate" 
        during the initial app fade-in.
      */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col min-h-screen bg-background"
        style={{ 
          visibility: isLoading ? 'hidden' : 'visible',
          pointerEvents: isLoading ? 'none' : 'auto' 
        }}
      >
        <Header />
        <main className="flex-grow pt-16 lg:pt-20 overflow-x-hidden">
          <AnimatePresence mode="wait" initial={false}>
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
      </motion.div>
    </AuthProvider>
  );
}
