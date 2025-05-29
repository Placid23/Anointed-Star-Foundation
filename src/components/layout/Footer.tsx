
import { Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="h-6 w-6 mr-2 text-primary" />
          <p className="text-lg font-semibold">Anointed Star Hub</p>
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
