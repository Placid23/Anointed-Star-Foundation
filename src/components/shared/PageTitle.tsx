import type { ReactNode } from 'react';

type PageTitleProps = {
  title: string;
  subtitle?: string | ReactNode;
  className?: string;
};

export default function PageTitle({ title, subtitle, className }: PageTitleProps) {
  return (
    <div className={`mb-8 md:mb-12 text-center ${className}`}>
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
