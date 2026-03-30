
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, UserPlus, ShieldCheck, ArrowRight } from 'lucide-react';
import type { UserRole } from '@/contexts/AuthContext';

const ADMIN_PASSWORD = '377899';

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
  role: z.enum(['sponsor', 'admin'], { required_error: 'Please select a role.' }),
  adminPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
    if (data.role === 'admin') {
        return data.adminPassword === ADMIN_PASSWORD;
    }
    return true;
}, {
    message: "Incorrect admin password. Please try again.",
    path: ["adminPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const containerVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6, 
      staggerChildren: 0.05 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function SignupPage() {
  const { signup, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | 'supporter'>('sponsor');

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'sponsor',
      adminPassword: ''
    },
  });

  const handleRoleChange = (value: string) => {
    const role = value as UserRole;
    setSelectedRole(role);
    form.setValue('role', role);
  };

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    await signup(data.fullName, data.email, data.password, data.role as UserRole);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
          <ShieldCheck className="text-accent h-6 w-6" /> Join the Mission
        </h1>
        <p className="text-white/60 font-medium">Create your "Star Hub" account to start impacting lives.</p>
      </div>

      <Card className="glass border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 gradient-gold opacity-50" />
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="bg-white/5 border-white/10 text-white rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} className="bg-white/5 border-white/10 text-white rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-white/10 text-white rounded-xl text-xs" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Confirm</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-white/10 text-white rounded-xl text-xs" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">I am joining as a...</FormLabel>
                      <Select onValueChange={(v) => {
                        field.onChange(v);
                        handleRoleChange(v);
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="glass border-white/10 text-white">
                          <SelectItem value="sponsor">Sponsor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {selectedRole === 'admin' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="adminPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-accent font-bold">Admin Verification Key</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter key" {...field} className="bg-accent/5 border-accent/20 text-accent rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 gradient-gold text-accent-foreground font-black rounded-xl shadow-[0_10px_20px_-10px_rgba(245,166,35,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                  Register Now <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 py-4 border-t border-white/5 bg-white/[0.02]">
            <p className="text-sm text-white/50">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-accent hover:underline">
                Sign In
              </Link>
            </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
