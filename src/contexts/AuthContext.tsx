
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  updateDoc
} from 'firebase/firestore';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';

export type UserRole = 'sponsor' | 'supporter' | 'admin';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  favorites?: string[];
  totalContributed?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (fullName: string, email: string, pass: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateRole: (newRole: UserRole) => Promise<void>;
  toggleFavorite: (programSlug: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  const auth = useFirebaseAuth();
  const db = useFirestore();

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeProfile) unsubscribeProfile();

      if (firebaseUser) {
        try {
          const profileRef = doc(db, 'profiles', firebaseUser.uid);
          unsubscribeProfile = onSnapshot(profileRef, (snapshot) => {
            if (snapshot.exists()) {
              const profile = snapshot.data();
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                fullName: profile.fullName || firebaseUser.displayName || 'User',
                role: (profile.role as UserRole) || 'supporter',
                favorites: profile.favorites || [],
                totalContributed: profile.totalContributed || 0,
              });
            } else {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                fullName: firebaseUser.displayName || 'User',
                role: 'supporter',
                favorites: [],
                totalContributed: 0,
              });
            }
            setLoading(false);
          }, (error) => {
            console.error("Error fetching profile:", error);
            setLoading(false);
          });
        } catch (error) {
          console.error("Auth sync error:", error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [auth, db]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast({ 
        title: 'Welcome Back!', 
        description: 'You have successfully signed into Anointed Foundation.' 
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ 
        title: 'Authentication Error', 
        description: 'Check your credentials and try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, pass: string, role: UserRole) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: fullName });

      await setDoc(doc(db, 'profiles', firebaseUser.uid), {
        fullName,
        role,
        email,
        favorites: [],
        totalContributed: 0,
        createdAt: new Date().toISOString()
      });

      await signOut(auth);
      setUser(null);

      toast({ title: 'Account Created!', description: `Welcome! Please log in to continue.` });
      router.push('/auth/login');
    } catch (error: any) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast({ title: 'Signed Out' });
      router.push('/auth/login');
    } catch (error: any) {
      toast({ title: 'Logout Error', variant: 'destructive' });
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: 'Instructions Sent!', description: `Reset link sent to ${email}.` });
      router.push('/auth/login');
    } catch (error: any) {
      toast({ title: 'Reset Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (newRole: UserRole) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'profiles', user.id), { role: newRole });
      toast({ title: 'Role Updated', description: `Account set to ${newRole}.` });
    } catch (error: any) {
      toast({ title: 'Update Failed', variant: 'destructive' });
    }
  };

  const toggleFavorite = async (programSlug: string) => {
    if (!user) {
      toast({ title: 'Sign In Required', description: 'Log in to save programs to your profile.', variant: 'destructive' });
      return;
    }

    const isFavorite = user.favorites?.includes(programSlug);
    const profileRef = doc(db, 'profiles', user.id);

    try {
      await updateDoc(profileRef, {
        favorites: isFavorite ? arrayRemove(programSlug) : arrayUnion(programSlug)
      });
      toast({ 
        title: isFavorite ? 'Removed from Favorites' : 'Saved to Favorites',
        description: isFavorite ? 'initiative removed.' : 'You can find this in your dashboard.'
      });
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, updateRole, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
