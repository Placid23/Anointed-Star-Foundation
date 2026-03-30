
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { MessageSquareText, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const feedbackSchema = z.object({
  feedback: z.string().min(10, { message: 'Feedback must be at least 10 characters long.' }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const db = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: '',
    },
  });

  const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        content: data.feedback,
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
        userEmail: user?.email || 'guest',
        userName: user?.fullName || 'Anonymous'
      });

      toast({
        title: 'Feedback Received!',
        description: "Thank you for sharing your thoughts with us. We've saved your message.",
      });
      form.reset();
    } catch (e: any) {
      toast({
        title: 'Error',
        description: 'Failed to send feedback. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Your Feedback</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your experience or share your suggestions..."
                    {...field}
                    rows={5}
                    className="bg-background/70 border-border shadow-sm focus:ring-accent"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <MessageSquareText className="mr-2 h-5 w-5" />}
            Send Feedback
          </Button>
        </form>
      </Form>
    </div>
  );
}
