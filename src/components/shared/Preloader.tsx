
'use client';

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
      <div className="relative mb-6">
        {/* Main Pulsing Star */}
        <Sparkles className="h-24 w-24 text-primary animate-preloader-icon-pulse" />

        {/* Decorative Smaller Sparkles */}
        <Sparkles className="absolute -top-6 -left-6 h-5 w-5 text-accent animate-preloader-sparkle-one opacity-70" />
        <Sparkles className="absolute top-1/2 -left-12 h-4 w-4 text-primary/70 animate-preloader-sparkle-two opacity-60" />
        <Sparkles className="absolute -bottom-5 -right-5 h-6 w-6 text-accent animate-preloader-sparkle-three opacity-75" />
        <Sparkles className="absolute top-1/4 -right-10 h-3 w-3 text-primary/60 animate-preloader-sparkle-one opacity-50" style={{animationDelay: '0.5s'}} />
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold text-primary animate-preloader-text-appear tracking-wide">
          Anointed Star Hub
        </p>
        <p className="mt-2 text-sm text-muted-foreground animate-preloader-subtext-appear">
          Illuminating Futures...
        </p>
      </div>
    </div>
  );
}
