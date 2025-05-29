
import { Sparkles, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="h-6 w-6 mr-2 text-primary" />
          <p className="text-lg font-semibold">Anointed Star Hub</p>
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

        <p className="text-sm">
          &copy; {currentYear} Anointed Star Hub. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Making a difference, one star at a time.
        </p>
      </div>
    </footer>
  );
}
