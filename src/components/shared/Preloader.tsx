
'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type PreloaderProps = {
  visible: boolean;
};

export default function Preloader({ visible }: PreloaderProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-in-out',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      aria-hidden={!visible}
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-6 flex flex-col items-center">
        {/* Main Logo Animation */}
        <div className="animate-preloader-logo-appear">
          <Image
            src="/anointed-star-hub-logo.jpg" 
            alt="Anointed Star Foundation Logo"
            width={180} 
            height={45} 
            className="object-contain animate-preloader-logo-pulse-glow"
            priority
          />
        </div>

        {/* Decorative Smaller Sparkles - positioned around the logo area */}
        <Sparkles className="absolute -top-8 -left-12 h-5 w-5 text-accent animate-preloader-sparkle-one opacity-70" style={{animationDelay: '0.2s'}}/>
        <Sparkles className="absolute top-1/2 -left-20 h-4 w-4 text-primary/70 animate-preloader-sparkle-two opacity-60" style={{animationDelay: '0.5s'}}/>
        <Sparkles className="absolute -bottom-8 -right-12 h-6 w-6 text-accent animate-preloader-sparkle-three opacity-75" style={{animationDelay: '0.3s'}}/>
        <Sparkles className="absolute top-0 -right-20 h-3 w-3 text-primary/60 animate-preloader-sparkle-one opacity-50" style={{animationDelay: '0.7s'}} />
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold text-primary animate-preloader-text-appear tracking-wide">
          Anointed Star Foundation
        </p>
        <p className="mt-2 text-sm text-muted-foreground animate-preloader-subtext-appear">
          Illuminating Futures...
        </p>
      </div>
    </div>
  );
}
