
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Menu, 
  UserCircle, 
  LayoutDashboard, 
  LogOut, 
  Info, 
  Home, 
  ShieldCheck, 
  FolderHeart,
  ChevronRight,
  Newspaper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Inline SVG for HeartHandshake to avoid Lucide HMR module factory errors
const HeartHandshakeIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
    <path d="m18 15-2-2" />
    <path d="m15 18-2-2" />
  </svg>
);

const coreNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Info },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/programs', label: 'Programs', icon: FolderHeart },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-[100] transition-all duration-300",
      scrolled ? "glass-header py-2" : "bg-transparent py-4 md:py-6"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="p-1 md:p-1.5 rounded-lg md:rounded-xl bg-accent/10 border border-accent/20 transition-all group-hover:scale-110">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={28} 
                height={28}  
                className="h-6 w-6 md:h-8 md:w-8 object-contain"
              />
            </div>
            <span className="font-black text-lg md:text-xl tracking-tighter text-white group-hover:text-accent transition-colors truncate uppercase">
              ANOINTED
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-2">
            <div className="flex items-center glass px-4 py-1.5 rounded-full border-white/5 mr-4">
              {coreNavItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={cn(
                    "text-[10px] uppercase tracking-widest font-bold px-4 py-2 hover:text-accent transition-colors relative",
                    pathname === item.href ? "text-accent" : "text-white/70"
                  )}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div layoutId="activeNav" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                  )}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10 hover:bg-white/10 transition-all outline-none">
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                        <UserCircle className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-wider">{user.fullName.split(' ')[0]}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass border-white/10 text-white shadow-2xl backdrop-blur-xl">
                    <DropdownMenuLabel className="font-bold flex flex-col">
                      <span>{user.fullName}</span>
                      <span className="text-[10px] text-white/40 font-normal">{user.email}</span>
                    </DropdownMenuLabel>
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
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-full font-bold text-[10px] uppercase tracking-widest">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              )}

              <Button asChild className="gradient-gold text-accent-foreground font-black px-8 rounded-full shadow-lg shadow-accent/20 hover:scale-105 transition-transform">
                <Link href="/donate">Donate</Link>
              </Button>
            </div>
          </nav>
          
          <div className="flex items-center gap-3 lg:hidden">
            <Button asChild size="sm" className="gradient-gold text-accent-foreground font-black rounded-full text-[10px] h-8 px-4">
              <Link href="/donate">Donate</Link>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 glass border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="glass border-white/10 text-white p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2">
                      <Image src="/favicon.ico" alt="Logo" width={24} height={24} />
                      <span className="font-black text-white tracking-tighter text-sm uppercase">Anointed</span>
                    </Link>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4">Navigation</p>
                      {coreNavItems.map((item) => (
                        <Link 
                          key={item.href} 
                          href={item.href} 
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl transition-all group",
                            pathname === item.href ? "bg-white/5 text-accent" : "text-white/70 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-accent" : "text-white/40")} />
                            <span className="font-bold tracking-tight">{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Account</p>
                      {user ? (
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                              <UserCircle className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-white truncate">{user.fullName}</p>
                              <p className="text-[10px] text-white/40 tracking-widest uppercase">{user.role}</p>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            {user.role === 'admin' && (
                              <Button asChild variant="outline" size="sm" className="w-full justify-start glass border-accent/20 text-accent">
                                <Link href="/admin"><ShieldCheck className="h-4 w-4 mr-2" /> Admin</Link>
                              </Button>
                            )}
                            <Button asChild variant="outline" size="sm" className="w-full justify-start glass border-white/5 text-white">
                              <Link href="/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard</Link>
                            </Button>
                            <Button onClick={() => logout()} variant="ghost" size="sm" className="w-full justify-start text-destructive">
                              <LogOut className="h-4 w-4 mr-2" /> Logout
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button asChild variant="outline" className="w-full h-14 glass border-white/10 text-white rounded-xl">
                          <Link href="/auth/login" className="flex items-center justify-center gap-2">
                            <UserCircle className="h-5 w-5" /> Sign In
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] border-t border-white/5">
                    <Button asChild className="w-full h-14 gradient-gold text-accent-foreground font-black rounded-2xl">
                      <Link href="/donate" className="flex items-center justify-between px-6">
                        Donate
                        <HeartHandshakeIcon className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
