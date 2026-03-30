'use client';

import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    // Ensure initialization only happens once on the client
    const initializedServices = initializeFirebase();
    setServices(initializedServices);
  }, []);

  // Prevent rendering if Firebase isn't initialized OR if we are on the server
  // This is key to fixing hydration and "Application Error" crashes.
  if (!services || !services.app) {
    return <div className="min-h-screen bg-[#0A0F1C]" />;
  }

  return (
    <FirebaseProvider
      app={services.app}
      firestore={services.firestore}
      auth={services.auth}
      storage={services.storage}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
