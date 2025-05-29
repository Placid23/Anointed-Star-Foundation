
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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
    // Simulate checking for an existing session
    // In a real app, you'd call Supabase here to get the current user
    const checkUser = async () => {
      // const { data: { session } } = await supabase.auth.getSession();
      // if (session?.user) {
      //   setUser({ id: session.user.id, email: session.user.email!, fullName: session.user.user_metadata?.fullName || 'User', role: session.user.user_metadata?.role || 'supporter' });
      // }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    // Placeholder for Supabase login
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Mock success
    const mockUser: User = { id: 'mock-user-id', email, fullName: 'Mock User', role: 'supporter' };
    setUser(mockUser);
    toast({ title: 'Login Successful', description: `Welcome back, ${mockUser.fullName}!` });
    router.push('/dashboard');
    setLoading(false);
    // if (error) {
    //   toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    //   setLoading(false);
    //   return;
    // }
    // if (data.user) {
    //   setUser({ id: data.user.id, email: data.user.email!, fullName: data.user.user_metadata?.fullName || 'User', role: data.user.user_metadata?.role || 'supporter' });
    //   router.push('/dashboard');
    //   toast({ title: 'Login Successful', description: 'Welcome back!' });
    // }
    // setLoading(false);
  };

  const signup = async (fullName: string, email: string, pass: string, role: UserRole) => {
    setLoading(true);
    // Placeholder for Supabase signup
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: { data: { fullName, role } },
    // });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Mock success - in real Supabase, user would need to confirm email
    toast({ title: 'Signup Almost Complete!', description: 'A confirmation email has been (mock) sent. Please check your inbox.' });
    // setUser({ id: 'new-mock-id', email, fullName, role }); // Don't auto-login, wait for "confirmation"
    // router.push('/auth/login'); // Or a page telling them to check email
    setLoading(false);

    // if (error) {
    //   toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
    //   setLoading(false);
    //   return;
    // }
    // toast({ title: 'Signup Successful', description: 'Please check your email to confirm your account.' });
    // setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    // Placeholder for Supabase logout
    // const { error } = await supabase.auth.signOut();
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    router.push('/auth/login');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    setLoading(false);
    // if (error) {
    //   toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    // }
    // setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    // Placeholder for Supabase password reset
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo: `${window.location.origin}/auth/update-password`, // Example redirect
    // });
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: 'Password Reset', description: 'If an account exists for this email, a password reset link has been (mock) sent.' });
    setLoading(false);
    // if (error) {
    //   toast({ title: 'Password Reset Failed', description: error.message, variant: 'destructive' });
    // }
    // setLoading(false);
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
