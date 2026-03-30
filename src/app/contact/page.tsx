'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        userName: data.name,
        userEmail: data.email,
        subject: data.subject,
        content: data.message,
        source: 'contact_page',
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      });

      toast({
        title: 'Message Sent Successfully!',
        description: "Thank you for reaching out to Anointed Foundation. We will review your message and get back to you shortly.",
      });
      form.reset();
    } catch (e: any) {
      toast({
        title: 'Submission Error',
        description: 'Something went wrong while sending your message. Please try again or email us directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper>
      <PageTitle
        title="Get In Touch"
        subtitle="We'd love to hear from you! Whether you have a question, a proposal, or just want to say hello, feel free to reach out."
      />
      <div className="grid md:grid-cols-2 gap-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll respond as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Regarding..." {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your message here..." {...field} rows={5} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Contact Information</CardTitle>
              <CardDescription>You can also reach us through the following channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                <a href="mailto:info@anointedfoundation.org" className="text-foreground/90 hover:text-primary">
                  info@anointedfoundation.org
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-foreground/90 hover:text-primary">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                <p className="text-foreground/90">
                  123 Charity Lane, Hope City, HC 54321
                  <br />
                  United States
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg" id="partner">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Partner With Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 mb-4">
                Anointed Foundation actively seeks partnerships with organizations, corporations, and individuals who share our commitment to creating positive change.
              </p>
              <Button asChild variant="outline">
                <a href="mailto:partnerships@anointedfoundation.org">
                  <Mail className="mr-2 h-4 w-4" /> Email Partnerships Team
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
