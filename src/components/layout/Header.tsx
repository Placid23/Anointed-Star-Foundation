
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, UserCircle, LogIn, UserPlus, LayoutDashboard, LogOut, FileText, Lightbulb, Info, Home, HandHeart, ChevronDown, Map, Newspaper, TrendingUp, LifeBuoy } from 'lucide-react';
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const coreNavItems = [
  { href: '/', label: 'Home', icon: Home, hoverAnimation: 'group-hover:animate-icon-bounce' },
  { href: '/about', label: 'About Us', icon: Info, hoverAnimation: 'group-hover:animate-icon-shake' },
  // { href: '/programs', label: 'Programs', icon: LifeBuoy, hoverAnimation: 'group-hover:animate-icon-float' },
  // { href: '/impact', label: 'Our Impact', icon: TrendingUp, hoverAnimation: 'group-hover:animate-icon-pulse-subtle' },
  // { href: '/news', label: 'News & Blog', icon: Newspaper, hoverAnimation: 'group-hover:animate-icon-shake' },
  { href: '/media', label: 'Media', icon: FileText, hoverAnimation: 'group-hover:animate-icon-shake' },
  { href: '/proposal-generator', label: 'Proposal AI', icon: Lightbulb, hoverAnimation: 'group-hover:animate-lightbulb-glow-hover' },
];

// Removed "More" dropdown items for now as per user request to have Media & Proposal AI directly in nav
// const moreNavItems = [
//   { href: '/media', label: 'Media', icon: FileText, hoverAnimation: 'group-hover:animate-icon-shake' },
//   { href: '/map', label: 'Areas of Operation', icon: Map, hoverAnimation: 'group-hover:animate-icon-bounce' },
//   { href: '/proposal-generator', label: 'Proposal AI', icon: Lightbulb, hoverAnimation: 'group-hover:animate-lightbulb-glow-hover' },
// ];

const allNavItems = [...coreNavItems]; // All items are core now

const donateNavItem = { href: '/donate', label: 'Donate', icon: HandHeart, hoverAnimation: 'group-hover:animate-icon-handheart-beat' };

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const renderIcon = (IconComponent: React.ElementType, animationClass?: string, baseClass?: string) => {
    return <IconComponent className={cn("h-4 w-4 opacity-70 group-hover:opacity-100 transition-all duration-200 ease-in-out group-hover:text-primary", baseClass, animationClass)} />;
  }
  
  const renderMobileIcon = (IconComponent: React.ElementType, animationClass?: string, baseClass?: string) => {
    return <IconComponent className={cn("h-5 w-5 text-muted-foreground transition-all duration-150 ease-in-out group-hover:translate-x-0.5 group-hover:text-primary", baseClass, animationClass)} />;
  }

  return (
    <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary group"
          >
            <Image
              src="/anointed-star-hub-logo.jpg"
              alt="Anointed Star Foundation Logo"
              width={120} 
              height={30}  
              className="h-8 w-auto object-contain group-hover:animate-quick-twinkle flex-shrink-0"
              priority
            />
            <span className="font-bold whitespace-nowrap text-base md:text-lg lg:text-xl">
              Anointed Star Foundation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {coreNavItems.map((item) => (
              <NavLink key={item.href} href={item.href} className="group text-sm">
                {renderIcon(item.icon, item.hoverAnimation, "mr-1.5")}
                {item.label}
              </NavLink>
            ))}
            
            {/* "More" Dropdown - Removed for now
            {moreNavItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="group text-sm px-3 py-2 flex items-center gap-1 text-foreground/70 hover:text-foreground hover:bg-muted">
                    More
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {moreNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2 group/menuitem">
                        {renderIcon(item.icon, item.hoverAnimation, "group-hover/menuitem:text-primary")} {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            */}
            
            <div className="flex items-center space-x-2 ml-3">
              {loading ? (
                <div className="animate-pulse h-8 w-8 bg-muted rounded-full"></div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full transition-transform duration-200 ease-in-out group hover:scale-110">
                      <UserCircle className="h-6 w-6 text-foreground/70 group-hover:text-primary group-hover:scale-110 transition-transform" />
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
                           <Link href="/dashboard" className="flex items-center gap-2 group/menuitem">
                            {renderIcon(LayoutDashboard, 'group-hover/menuitem:animate-icon-pulse-subtle', 'group-hover/menuitem:text-primary')} Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive group/menuitem">
                          {renderIcon(LogOut, 'group-hover/menuitem:animate-icon-point-left', 'group-focus/menuitem:text-destructive group-hover/menuitem:text-destructive')} Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/auth/login" className="flex items-center gap-2 group/menuitem">
                            {renderIcon(LogIn, 'group-hover/menuitem:animate-icon-point-right', 'group-hover/menuitem:text-primary')} Login
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/auth/signup" className="flex items-center gap-2 group/menuitem">
                             {renderIcon(UserPlus, 'group-hover/menuitem:animate-icon-point-right', 'group-hover/menuitem:text-primary')} Sign Up
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {donateNavItem && (
                <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground group">
                  <Link href={donateNavItem.href} className="flex items-center gap-1.5">
                    <HandHeart className={cn("h-4 w-4 transition-transform duration-200 ease-in-out", donateNavItem.hoverAnimation)}/> {donateNavItem.label}
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
              className="transition-all duration-200 ease-in-out hover:bg-muted hover:text-primary hover:scale-110 focus:ring-2 focus:ring-primary/50"
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
                className="block py-2.5 text-base flex items-center gap-3 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                {renderMobileIcon(item.icon, item.hoverAnimation)}
                {item.label}
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
                <NavLink href="/dashboard" className="block py-2.5 text-base flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
                   {renderMobileIcon(LayoutDashboard, 'group-hover:animate-icon-pulse-subtle')} Dashboard
                </NavLink>
                <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start mt-1 py-2.5 text-base flex items-center gap-3 text-destructive hover:text-destructive group">
                  {renderMobileIcon(LogOut, 'group-hover:animate-icon-point-left', 'group-focus:text-destructive')} Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/auth/login" className="block py-2.5 text-base flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
                  {renderMobileIcon(LogIn, 'group-hover:animate-icon-point-right')} Login
                </NavLink>
                <NavLink href="/auth/signup" className="block py-2.5 text-base flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
                  {renderMobileIcon(UserPlus, 'group-hover:animate-icon-point-right')} Sign Up
                </NavLink>
              </>
            )}
            <hr className="my-2 border-border"/>
            {donateNavItem && (
              <Button asChild size="lg" className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground group">
                <Link href={donateNavItem.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <HandHeart className={cn("h-5 w-5 transition-transform duration-200 ease-in-out", donateNavItem.hoverAnimation)} /> {donateNavItem.label}
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
