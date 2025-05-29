
"use client";
import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import NavLink from './NavLink';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/programs', label: 'Programs' },
  { href: '/impact', label: 'Our Impact' },
  { href: '/media', label: 'Media' },
  { href: '/map', label: 'Areas of Operation' },
  { href: '/proposal-generator', label: 'Proposal AI' },
  { href: '/news', label: 'News & Blog' },
  // Donate item will be handled separately
];

const donateNavItem = { href: '/donate', label: 'Donate' };

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter out the donate link if it's accidentally in navItems
  const mainNavItems = navItems.filter(item => item.href !== donateNavItem.href);

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            <Sparkles className="h-7 w-7" /> {/* Slightly smaller logo icon */}
            <span>Anointed Star Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            {donateNavItem && (
              <Button asChild size="sm" className="ml-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={donateNavItem.href}>{donateNavItem.label}</Link>
              </Button>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 absolute w-full shadow-lg">
          <nav className="flex flex-col space-y-1 px-4 py-4">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="block py-2.5 text-base" // Slightly larger tap area and text
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {donateNavItem && (
              <Button asChild size="default" className="w-full mt-3 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground text-base">
                <Link href={donateNavItem.href} onClick={() => setMobileMenuOpen(false)}>{donateNavItem.label}</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
