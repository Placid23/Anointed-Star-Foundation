'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

  if (!isConfigValid) {
    if (typeof window !== 'undefined') {
      console.warn('Firebase configuration is incomplete. The app will render but database features will be disabled. Please set your Environment Variables in Vercel.');
    }
    // Return safe dummy objects to prevent provider crashes
    return {
      app: {} as FirebaseApp,
      firestore: {} as Firestore,
      auth: {} as Auth,
      storage: {} as FirebaseStorage,
      isConfigured: false
    };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    return { app, firestore, auth, storage, isConfigured: true };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return {
      app: {} as FirebaseApp,
      firestore: {} as Firestore,
      auth: {} as Auth,
      storage: {} as FirebaseStorage,
      isConfigured: false
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './utils/use-memo-firebase';
