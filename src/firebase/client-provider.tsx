'use client';

import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    // Initialize services on mount
    const initializedServices = initializeFirebase();
    setServices(initializedServices);
  }, []);

  // Always render something to prevent blank screen during hydration
  // We use a mounting state pattern to avoid hydration mismatch
  if (!services) {
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
