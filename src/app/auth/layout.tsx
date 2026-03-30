
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Star } from 'lucide-react';
import SectionWrapper from '@/components/shared/SectionWrapper';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A0F1C] overflow-hidden">
      {/* Left Panel: Branding (Hidden on mobile) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden border-r border-white/5"
      >
        {/* Shifting Gradient Background */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={120}
                height={120}
                className="relative z-10 glow-pulse drop-shadow-[0_0_25px_rgba(245,166,35,0.4)]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
              <Star className="h-3 w-3 fill-current" />
              <span>Premium Access</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
              Welcome to the <br />
              <span className="text-gradient-gold">Star Hub</span>
            </h2>
            <p className="text-white/60 text-lg font-medium leading-relaxed">
              Step into a world of illuminated potential. Your journey with Anointed Foundation continues here.
            </p>
          </motion.div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity, 
                delay: Math.random() * 5 
              }}
              className="absolute h-1 w-1 bg-accent rounded-full blur-[1px]"
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%` 
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right Panel: Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
