// This file is machine-generated - changes may be lost.
'use server';
/**
 * @fileOverview An AI agent that generates personalized donation proposals based on donor profiles and program details.
 *
 * - generateDonationProposal - A function that generates a personalized donation proposal.
 * - GenerateDonationProposalInput - The input type for the generateDonationProposal function.
 * - GenerateDonationProposalOutput - The return type for the generateDonationProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDonationProposalInputSchema = z.object({
  donorProfile: z
    .string()
    .describe('Detailed profile of the donor, including their interests, past donations, and connection to the foundation.'),
  programDetails: z
    .string()
    .describe('Comprehensive details about the specific program for which the donation is being requested, including its goals, activities, and impact.'),
  suggestedDonationAmount: z
    .number()
    .describe('A suggested donation amount based on the donor profile and program needs.'),
  additionalContext: z
    .string()
    .optional()
    .describe('Any additional context or information that might be relevant to the proposal.'),
});
export type GenerateDonationProposalInput = z.infer<typeof GenerateDonationProposalInputSchema>;

const GenerateDonationProposalOutputSchema = z.object({
  proposal: z.string().describe('A personalized donation proposal tailored to the donor and program.'),
});
export type GenerateDonationProposalOutput = z.infer<typeof GenerateDonationProposalOutputSchema>;

export async function generateDonationProposal(input: GenerateDonationProposalInput): Promise<GenerateDonationProposalOutput> {
  return generateDonationProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDonationProposalPrompt',
  input: {schema: GenerateDonationProposalInputSchema},
  output: {schema: GenerateDonationProposalOutputSchema},
  prompt: `You are an expert fundraiser specializing in creating personalized donation proposals.

  Based on the donor's profile and the details of the program, create a compelling donation proposal.
  The proposal should clearly articulate the need for the donation, the impact it will have, and how it aligns with the donor's interests.
  Be sure to include the suggested donation amount and any additional context provided.

  Donor Profile: {{{donorProfile}}}
  Program Details: {{{programDetails}}}
  Suggested Donation Amount: {{{suggestedDonationAmount}}}
  Additional Context: {{{additionalContext}}}

  Generate a personalized donation proposal:
  `,
});

const generateDonationProposalFlow = ai.defineFlow(
  {
    name: 'generateDonationProposalFlow',
    inputSchema: GenerateDonationProposalInputSchema,
    outputSchema: GenerateDonationProposalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
