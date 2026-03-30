
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LogIn, Sparkles, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function LoginPage() {
  const { login, loading } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="text-center lg:text-left mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
          <Sparkles className="text-accent h-6 w-6" /> Welcome Back
        </h1>
        <p className="text-white/60 font-medium">Please enter your details to access your account.</p>
      </div>

      <Card className="glass border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 gradient-gold opacity-50" />
        <CardHeader>
          <CardTitle className="text-xl text-white">Sign In</CardTitle>
          <CardDescription className="text-white/40">Secure verification required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          {...field} 
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-accent/50 focus:ring-accent/20 transition-all rounded-xl h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-white/70">Password</FormLabel>
                        <Link href="/auth/reset-password">
                          <span className="text-xs text-accent hover:underline font-bold">Forgot?</span>
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-accent/50 focus:ring-accent/20 transition-all rounded-xl h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 gradient-gold text-accent-foreground font-black rounded-xl shadow-[0_10px_20px_-10px_rgba(245,166,35,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                  Sign In <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 pt-4 border-t border-white/5 bg-white/[0.02]">
            <p className="text-sm text-white/50">
              New to Anointed?{' '}
              <Link href="/auth/signup" className="font-bold text-accent hover:underline">
                Create Account
              </Link>
            </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
