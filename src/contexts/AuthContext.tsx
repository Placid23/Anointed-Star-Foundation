
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';


type UserRole = 'sponsor' | 'supporter' | 'admin';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (fullName: string, email: string, pass: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.fullName || session.user.email?.split('@')[0] || 'User',
          role: (session.user.user_metadata?.role as UserRole) || 'supporter',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check initial session explicitly as onAuthStateChange might not fire immediately for an existing session on page load.
    async function getInitialSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUser({
                id: session.user.id,
                email: session.user.email!,
                fullName: session.user.user_metadata?.fullName || session.user.email?.split('@')[0] || 'User',
                role: (session.user.user_metadata?.role as UserRole) || 'supporter',
            });
        }
        setLoading(false);
    }
    getInitialSession();


    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

    if (error) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    } else if (data.user) {
      // onAuthStateChange will handle setting the user.
      toast({ title: 'Login Successful', description: `Welcome back, ${data.user.user_metadata?.fullName || data.user.email}!` });
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const signup = async (fullName: string, email: string, pass: string, role: UserRole) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { fullName, role }, // Store fullName and role in user_metadata
      },
    });

    if (error) {
      toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
    } else if (data.user) {
      if (data.session) { // User is immediately signed in (e.g. auto-confirm is on)
        toast({ title: 'Signup Successful!', description: 'Welcome! Your account has been created and you are now logged in.' });
        router.push('/dashboard'); // onAuthStateChange will set the user
      } else { // Email confirmation needed
        toast({ title: 'Signup Almost Complete!', description: 'A confirmation email has been sent. Please check your inbox to activate your account.' });
         router.push('/auth/login'); // Redirect to login, they can login after confirming
      }
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    } else {
      // setUser(null) will be handled by onAuthStateChange
      router.push('/auth/login');
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    }
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // redirectTo: `${window.location.origin}/auth/update-password`, // Optional: if you have a custom update password page
    });

    if (error) {
      toast({ title: 'Password Reset Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password Reset Email Sent', description: 'If an account exists for this email, a password reset link has been sent.' });
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
