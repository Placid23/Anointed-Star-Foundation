'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Compass, Sparkles } from 'lucide-react';
import SectionWrapper from '@/components/shared/SectionWrapper';

export default function NotFound() {
  return (
    <SectionWrapper className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
          <h1 className="text-9xl font-black text-white relative z-10 tracking-tighter">
            4<span className="text-gradient-gold">0</span>4
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <Compass className="text-accent h-8 w-8 animate-spin-slow" />
            Lost in the Stars?
          </h2>
          <p className="text-white/60 max-w-md mx-auto text-lg">
            The page you are looking for has drifted into deep space. 
            Let's get you back to the Star Hub.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="gradient-gold text-accent-foreground font-black rounded-full px-8">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" /> Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="glass border-white/10 text-white rounded-full px-8">
            <Link href="/programs">
              <Sparkles className="mr-2 h-5 w-5 text-accent" /> Explore Programs
            </Link>
          </Button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
