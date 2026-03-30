
'use client';

/**
 * @fileOverview Firebase configuration module.
 * 
 * This file pulls Firebase configuration from environment variables.
 * For local development, ensure these are set in your .env file.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that the essential config is present
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.warn(
    'Firebase API Key is missing. Please ensure environment variables are correctly loaded.'
  );
}
