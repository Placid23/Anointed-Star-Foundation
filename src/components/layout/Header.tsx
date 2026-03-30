
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, UserCircle, LogIn, UserPlus, LayoutDashboard, LogOut, Lightbulb, Info, Home, HandHeart, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import NavLink from './NavLink';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const coreNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Info },
  { href: '/news', label: 'News', icon: Info },
  { href: '/proposal-generator', label: 'AI Tool', icon: Lightbulb },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={cn(
      "fixed top-0 w-full z-[100] transition-all duration-300",
      scrolled ? "glass-header py-2" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-xl bg-accent/10 border border-accent/20 transition-all group-hover:scale-110">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={32} 
                height={32}  
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="font-black text-xl tracking-tighter text-white group-hover:text-accent transition-colors">
              ANOINTED
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            <div className="flex items-center glass px-4 py-1.5 rounded-full border-white/5 mr-4">
              {coreNavItems.map((item) => (
                <NavLink key={item.href} href={item.href} className="text-xs uppercase tracking-widest font-bold px-4 hover:text-accent transition-colors relative">
                  {item.label}
                  {pathname === item.href && (
                    <motion.div layoutId="activeNav" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                  )}
                </NavLink>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full glass border-white/10 hover:bg-white/10">
                      <UserCircle className="h-5 w-5 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass border-white/10 text-white">
                    <DropdownMenuLabel className="font-bold">{user.fullName}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 text-accent font-bold cursor-pointer">
                          <ShieldCheck className="h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-full font-bold text-xs uppercase tracking-widest">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              )}

              <Button asChild className="gradient-gold text-accent-foreground font-black px-8 rounded-full shadow-lg shadow-accent/20 hover:scale-105 transition-transform">
                <Link href="/donate">Donate</Link>
              </Button>
            </div>
          </nav>
          
          {/* Mobile Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden glass border-white/10 text-white">
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-header border-t border-white/5 overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {coreNavItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-xl font-bold text-white/80 hover:text-accent">
                  {item.label}
                </Link>
              ))}
              <hr className="border-white/5" />
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-accent font-black text-lg">Admin Control</Link>
                  )}
                  <Link href="/dashboard" className="text-white/80">Dashboard</Link>
                  <button onClick={logout} className="text-destructive text-left">Logout</button>
                </>
              ) : (
                <Link href="/auth/login" className="text-white/80 font-bold">Sign In</Link>
              )}
              <Button asChild className="gradient-gold text-accent-foreground font-black py-6">
                <Link href="/donate">Support Mission</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
