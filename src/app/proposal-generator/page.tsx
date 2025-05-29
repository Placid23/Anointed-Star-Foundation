'use client';

import { useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateDonationProposal } from '@/ai/flows/generate-donation-proposal';
import type { GenerateDonationProposalInput, GenerateDonationProposalOutput } from '@/ai/flows/generate-donation-proposal';
import { Loader2, Wand2 } from 'lucide-react';

const proposalSchema = z.object({
  donorProfile: z.string().min(10, { message: 'Donor profile must be at least 10 characters.' }),
  programDetails: z.string().min(10, { message: 'Program details must be at least 10 characters.' }),
  suggestedDonationAmount: z.coerce.number().positive({ message: 'Suggested donation amount must be a positive number.' }),
  additionalContext: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

export default function ProposalGeneratorPage() {
  const [isPending, startTransition] = useTransition();
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      donorProfile: '',
      programDetails: '',
      suggestedDonationAmount: 100,
      additionalContext: '',
    },
  });

  const onSubmit: SubmitHandler<ProposalFormValues> = async (data) => {
    startTransition(async () => {
      try {
        setGeneratedProposal(null);
        const result: GenerateDonationProposalOutput = await generateDonationProposal(data as GenerateDonationProposalInput);
        if (result && result.proposal) {
          setGeneratedProposal(result.proposal);
          toast({
            title: 'Proposal Generated!',
            description: 'Your personalized donation proposal is ready.',
          });
        } else {
          throw new Error('Failed to generate proposal.');
        }
      } catch (error) {
        console.error('Error generating proposal:', error);
        toast({
          title: 'Error',
          description: 'Could not generate proposal. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <SectionWrapper>
      <PageTitle
        title="AI Donation Proposal Generator"
        subtitle="Craft personalized donation proposals effortlessly with our AI-powered tool. Fill in the details below to get started."
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Proposal Details</CardTitle>
            <CardDescription>Provide the necessary information to generate a tailored proposal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="donorProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donor Profile</FormLabel>
                      <FormControl>
                        <Textarea placeholder="E.g., Long-time supporter, interested in education, previously donated to X program..." {...field} rows={4} />
                      </FormControl>
                      <FormDescription>Detailed profile of the donor.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="programDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="E.g., Youth Empowerment Initiative, aims to provide skills training to 100 youths..." {...field} rows={4} />
                      </FormControl>
                      <FormDescription>Comprehensive details about the specific program.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="suggestedDonationAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggested Donation Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormDescription>Based on donor profile and program needs.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="E.g., Upcoming matching gift campaign, specific impact story to include..." {...field} rows={3} />
                      </FormControl>
                      <FormDescription>Any other relevant information.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Generate Proposal
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Generated Proposal</CardTitle>
            <CardDescription>Your AI-crafted proposal will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] bg-muted/30 p-6 rounded-md prose max-w-none">
            {isPending && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-foreground/70">Generating your personalized proposal...</p>
              </div>
            )}
            {!isPending && generatedProposal && (
              <div dangerouslySetInnerHTML={{ __html: generatedProposal.replace(/\n/g, '&lt;br /&gt;') }} />
            )}
            {!isPending && !generatedProposal && (
              <p className="text-foreground/60 italic text-center pt-10">
                Fill out the form and click "Generate Proposal" to see the magic happen.
              </p>
            )}
          </CardContent>
          {generatedProposal && !isPending && (
             <CardFooter>
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedProposal)} className="w-full">
                    Copy Proposal Text
                </Button>
             </CardFooter>
          )}
        </Card>
      </div>
    </SectionWrapper>
  );
}
