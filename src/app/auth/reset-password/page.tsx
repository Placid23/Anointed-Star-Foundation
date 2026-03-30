'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import SectionWrapper from '@/components/shared/SectionWrapper';
import PageTitle from '@/components/shared/PageTitle';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, MailQuestion, ArrowLeft } from 'lucide-react';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { resetPassword, loading } = useAuth();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    await resetPassword(data.email);
  };

  return (
    <SectionWrapper>
      <div className="max-w-md mx-auto mb-6">
        <Button asChild variant="ghost" className="group -ml-4 text-muted-foreground hover:text-primary">
          <Link href="/auth/login">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
        </Button>
      </div>

      <PageTitle title="Account Recovery" />
      <Card className="max-w-md mx-auto shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <MailQuestion className="h-6 w-6" />
            Forgot Password?
          </CardTitle>
          <CardDescription>
            Enter your email address and we will send you a secure link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        {...field} 
                        className="bg-background"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 pt-4 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Suddenly remembered?{' '}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Return to Login
              </Link>
            </p>
        </CardFooter>
      </Card>
    </SectionWrapper>
  );
}
