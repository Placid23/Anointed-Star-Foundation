
"use client";
import Link from 'next/link';
import { Sparkles, Menu, X, UserCircle, ChevronDown, LogIn, UserPlus, LayoutDashboard, LogOut, LifeBuoy, Map, FileText, Lightbulb, Newspaper, Info, Home, TrendingUp, Users2Icon, HandHeart } from 'lucide-react';
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

const coreNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/programs', label: 'Programs', icon: LifeBuoy },
  { href: '/impact', label: 'Our Impact', icon: TrendingUp },
  { href: '/news', label: 'News & Blog', icon: Newspaper },
];

const moreNavItems = [
  { href: '/media', label: 'Media', icon: FileText },
  { href: '/map', label: 'Areas of Operation', icon: Map },
  { href: '/proposal-generator', label: 'Proposal AI', icon: Lightbulb },
];

const allNavItems = [...coreNavItems, ...moreNavItems];

const donateNavItem = { href: '/donate', label: 'Donate', icon: HandHeart };

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            <Sparkles className="h-6 w-6" />
            <span className="hidden sm:inline">Anointed Star Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {coreNavItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}

            {moreNavItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted data-[state=open]:bg-muted">
                    More <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {moreNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <div className="flex items-center space-x-2 ml-3">
              {loading ? (
                <div className="animate-pulse h-8 w-8 bg-muted rounded-full"></div> // Skeleton for user icon
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <UserCircle className="h-6 w-6 text-foreground/70 hover:text-primary" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {user ? (
                      <>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.fullName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/dashboard" className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive" /> Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/auth/login" className="flex items-center gap-2">
                            <LogIn className="h-4 w-4 text-muted-foreground" /> Login
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/auth/signup" className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-muted-foreground" /> Sign Up
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {donateNavItem && (
                <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href={donateNavItem.href} className="flex items-center gap-1.5">
                    <donateNavItem.icon className="h-4 w-4"/> {donateNavItem.label}
                  </Link>
                </Button>
              )}
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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
        <div className="md:hidden border-t border-border bg-background/95 absolute w-full shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col space-y-1 px-2 py-4">
            {allNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="block py-2.5 text-base flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 text-muted-foreground" /> {item.label}
              </NavLink>
            ))}
            <hr className="my-2 border-border"/>
            {loading ? (
                 <div className="space-y-2 px-2">
                    <div className="animate-pulse h-10 w-full bg-muted rounded-md"></div>
                    <div className="animate-pulse h-10 w-full bg-muted rounded-md"></div>
                 </div>
            ) : user ? (
              <>
                <NavLink href="/dashboard" className="block py-2.5 text-base flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="h-5 w-5 text-muted-foreground" /> Dashboard
                </NavLink>
                <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start mt-1 py-2.5 text-base flex items-center gap-3 text-destructive hover:text-destructive">
                  <LogOut className="h-5 w-5 text-muted-foreground" /> Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/auth/login" className="block py-2.5 text-base flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <LogIn className="h-5 w-5 text-muted-foreground" /> Login
                </NavLink>
                <NavLink href="/auth/signup" className="block py-2.5 text-base flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <UserPlus className="h-5 w-5 text-muted-foreground" /> Sign Up
                </NavLink>
              </>
            )}
            <hr className="my-2 border-border"/>
            {donateNavItem && (
              <Button asChild size="lg" className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={donateNavItem.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <donateNavItem.icon className="h-5 w-5"/> {donateNavItem.label}
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
