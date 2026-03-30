
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function NavLink({ href, children, className, onClick, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center', // Added flex items-center
        isActive
          ? 'bg-primary/20 text-primary hover:bg-primary/30'
          : 'text-foreground/70 hover:text-foreground hover:bg-muted',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
}
