
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

const COOKIE_CONSENT_KEY = 'anointed_star_hub_cookie_consent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client-side after mount
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Alert
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[2000] m-4 md:m-6 p-4 md:p-6 shadow-2xl rounded-lg border-border bg-card/95 backdrop-blur-sm',
        'md:max-w-xl md:left-auto md:right-6 transform transition-all duration-500 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
      role="region"
      aria-label="Cookie Consent Banner"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="h-8 w-8 text-primary flex-shrink-0 mt-1 sm:mt-0" />
        <div className="flex-grow">
          <AlertTitle className="text-lg font-semibold text-primary">We Value Your Privacy</AlertTitle>
          <AlertDescription className="text-sm text-card-foreground/80 mt-1">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking &quot;Accept&quot;, you consent to our use of cookies.
          </AlertDescription>
        </div>
        <Button onClick={handleAccept} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground px-6" size="lg">
          Accept
        </Button>
      </div>
    </Alert>
  );
}
