import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageTitleProps = {
  title: string;
  subtitle?: string | ReactNode;
  className?: string;
};

export default function PageTitle({ title, subtitle, className }: PageTitleProps) {
  return (
    <div className={cn("mb-8 md:mb-12 text-center px-4", className)}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 md:mb-4 tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <div className="text-base md:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </div>
      )}
    </div>
  );
}
