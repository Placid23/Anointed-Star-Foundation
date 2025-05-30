
'use client';

import { Sparkles, Facebook, Twitter, Instagram, Linkedin, Palette } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="h-6 w-6 mr-2 text-primary" />
          <p className="text-lg font-semibold">Anointed Star Foundation</p>
        </div>
        
        <div className="mb-4 flex justify-center space-x-6">
          <Link href="#" aria-label="Facebook" className="text-foreground/70 hover:text-primary transition-colors">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" aria-label="Twitter" className="text-foreground/70 hover:text-primary transition-colors">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" aria-label="Instagram" className="text-foreground/70 hover:text-primary transition-colors">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" aria-label="LinkedIn" className="text-foreground/70 hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>

        <p className="my-4 text-xs text-muted-foreground/80 font-serif tracking-wider flex items-center justify-center space-x-2">
          <Palette className="h-3.5 w-3.5" />
          <span>Website crafted by Placid Kingsley</span>
        </p>

        <p className="text-sm">
          &copy; {isClient ? currentYear : '...'} Anointed Star Foundation. All rights reserved.
          {/* 
            The server will render '...' because isClient is initially false.
            The client will also initially render '...' because isClient is false.
            After hydration, useEffect runs, isClient becomes true, currentYear is set,
            and React re-renders this part to show the actual year.
            This two-step render on the client (initial with '...', then update with year)
            ensures no hydration mismatch for the dynamic year.
          */}
        </p>
        <p className="text-xs mt-2">
          Making a difference, one star at a time.
        </p>
      </div>
    </footer>
  );
}
