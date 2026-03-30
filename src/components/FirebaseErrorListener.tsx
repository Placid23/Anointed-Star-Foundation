'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In a real production app, you might log this to a service.
      // Here we show a destructive toast for immediate developer/user feedback.
      toast({
        variant: 'destructive',
        title: 'Security Permission Denied',
        description: 'You do not have permission to perform this action. If you are an admin, please check your role.',
      });
      
      // We throw it so it's caught by Next.js error boundaries if necessary
      // and visible in the console during development.
      console.error(error);
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.removeListener('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
