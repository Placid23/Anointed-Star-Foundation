
'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type PreloaderProps = {
  visible: boolean;
};

export default function Preloader({ visible }: PreloaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0A0F1C]"
          role="status"
          aria-live="polite"
        >
          <div className="relative mb-8 flex flex-col items-center">
            {/* Using Favicon for Preloader as requested */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="p-4 rounded-full bg-accent/10 border border-accent/20 glow-accent animate-breathing">
                <Image
                  src="/favicon.ico" 
                  alt="Anointed Foundation Icon"
                  width={80} 
                  height={80} 
                  className="object-contain"
                  priority 
                />
              </div>
            </motion.div>

            {/* Decorative Sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 -m-8 pointer-events-none"
            >
              <Sparkles className="absolute top-0 left-0 h-6 w-6 text-accent opacity-50" />
              <Sparkles className="absolute bottom-0 right-0 h-4 w-4 text-primary opacity-40" />
              <Sparkles className="absolute top-1/2 -right-4 h-5 w-5 text-accent opacity-30" />
            </motion.div>
          </div>

          <div className="text-center overflow-hidden">
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl font-black text-white tracking-widest text-gradient-gold uppercase"
            >
              Anointed
            </motion.p>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-2 text-sm text-muted-foreground uppercase tracking-[0.3em] font-medium"
            >
              Illuminating Happiness
            </motion.p>
          </div>
          
          <div className="mt-12 w-48 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 gradient-gold"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
