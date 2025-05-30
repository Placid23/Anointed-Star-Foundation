
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { MessageSquareText } from 'lucide-react';

const feedbackSchema = z.object({
  feedback: z.string().min(10, { message: 'Feedback must be at least 10 characters long.' }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackForm() {
  const { toast } = useToast();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: '',
    },
  });

  const onSubmit: SubmitHandler<FeedbackFormValues> = (data) => {
    console.log('Feedback submitted:', data); // Placeholder for actual submission
    toast({
      title: 'Feedback Submitted!',
      description: "Thank you for sharing your thoughts with us.",
    });
    form.reset();
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
                <FormLabel className="sr-only">Your Feedback</FormLabel> {/* Label is sr-only as placeholder acts as visual label */}
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your experience or share your suggestions..."
                    {...field}
                    rows={5}
                    className="bg-background/70 border-border shadow-sm focus:ring-accent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <MessageSquareText className="mr-2 h-5 w-5" /> Send Feedback
          </Button>
        </form>
      </Form>
    </div>
  );
}
