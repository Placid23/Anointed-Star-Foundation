
"use client";
import Link from 'next/link';
import { Sparkles, Menu, X, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import NavLink from './NavLink';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const baseNavItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/programs', label: 'Programs' },
  { href: '/impact', label: 'Our Impact' },
  { href: '/media', label: 'Media' },
  { href: '/map', label: 'Areas of Operation' },
  { href: '/proposal-generator', label: 'Proposal AI' },
  { href: '/news', label: 'News & Blog' },
];

const donateNavItem = { href: '/donate', label: 'Donate' };

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth(); // Get auth state

  const mainNavItems = baseNavItems.filter(item => item.href !== donateNavItem.href);

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            <Sparkles className="h-7 w-7" />
            <span>Anointed Star Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            {loading ? (
              <div className="animate-pulse h-8 w-20 bg-muted rounded-md ml-3"></div> // Skeleton loader
            ) : user ? (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <Button onClick={logout} variant="outline" size="sm" className="ml-3">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/auth/login">
                  <LogIn className="mr-1 h-4 w-4 inline-block" /> Login
                </NavLink>
                <NavLink href="/auth/signup">
                  <UserPlus className="mr-1 h-4 w-4 inline-block" /> Sign Up
                </NavLink>
              </>
            )}
            {donateNavItem && (
              <Button asChild size="sm" className="ml-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={donateNavItem.href}>{donateNavItem.label}</Link>
              </Button>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             {donateNavItem && (
              <Button asChild size="sm" className="mr-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={donateNavItem.href}>{donateNavItem.label}</Link>
              </Button>
            )}
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
                className="block py-2.5 text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <hr className="my-2 border-border"/>
            {loading ? (
                 <div className="space-y-2">
                    <div className="animate-pulse h-8 w-full bg-muted rounded-md"></div>
                    <div className="animate-pulse h-8 w-full bg-muted rounded-md"></div>
                 </div>
            ) : user ? (
              <>
                <NavLink href="/dashboard" className="block py-2.5 text-base" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="mr-2 h-4 w-4 inline-block" /> Dashboard
                </NavLink>
                <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" className="w-full mt-2 py-2.5 text-base">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/auth/login" className="block py-2.5 text-base" onClick={() => setMobileMenuOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4 inline-block" /> Login
                </NavLink>
                <NavLink href="/auth/signup" className="block py-2.5 text-base" onClick={() => setMobileMenuOpen(false)}>
                  <UserPlus className="mr-2 h-4 w-4 inline-block" /> Sign Up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
