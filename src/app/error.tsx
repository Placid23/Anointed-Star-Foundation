'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <SectionWrapper>
        <div className="text-center">
            <PageTitle title="Something Went Wrong" subtitle="We apologize for the inconvenience. An unexpected error occurred."/>
            
            <p className="mb-4 text-destructive">{error.message || "An unknown error occurred."}</p>
            {error.digest && <p className="text-xs text-muted-foreground mb-6">Error Digest: {error.digest}</p>}
            
            <Button
                onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
                }
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
                Try Again
            </Button>
        </div>
    </SectionWrapper>
  );
}
