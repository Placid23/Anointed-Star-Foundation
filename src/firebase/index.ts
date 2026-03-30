'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  // Safety check: If essential config is missing, return a minimal set of services 
  // or handle gracefully to prevent deployment crashes.
  const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

  if (!isConfigValid) {
    if (typeof window !== 'undefined') {
      console.error('Firebase configuration is incomplete. Please check your environment variables.');
    }
    // Return null or handle as needed - here we let initializeApp throw if it must, 
    // but we've warned the dev clearly.
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  return { app, firestore, auth, storage };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './utils/use-memo-firebase';
