
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, Heart, DollarSign, RefreshCw, Globe, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const donationSchema = z.object({
  amount: z.coerce.number(),
  customAmount: z.string().optional(),
  currency: z.string().min(3, { message: 'Please select a currency.' }),
  donationType: z.enum(['one-time', 'recurring'], { required_error: 'Please select a donation type.' }),
  program: z.string().optional(),
  fullName: z.string().min(1, { message: 'First name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  anonymous: z.boolean().default(false),
  coverFees: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (data.amount === -1) {
    if (!data.customAmount || data.customAmount.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a custom donation amount.', path: ['customAmount'] });
      return;
    }
    const parsedCustomAmount = parseFloat(data.customAmount);
    if (isNaN(parsedCustomAmount) || parsedCustomAmount <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Custom donation amount must be a positive number.', path: ['customAmount'] });
    }
  } else if (data.amount <= 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Selected donation amount must be positive.', path: ['amount'] });
  }
});

type DonationFormValues = z.infer<typeof donationSchema>;

const currencyOptions = [
  { value: 'USD', label: 'USD - United States Dollar', symbol: '$' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'CA$' },
  { value: 'NGN', label: 'NGN - Nigerian Naira', symbol: '₦' },
];

const getSuggestedAmounts = (currency: string) => {
  if (currency === 'NGN') {
    return [5000, 10000, 50000, 100000, 500000, 1000000];
  }
  return [25, 50, 100, 250, 500];
};

const getCurrencySymbol = (currencyCode: string): string => {
  return currencyOptions.find(c => c.value === currencyCode)?.symbol || currencyCode;
};

const programDedicationOptions = [
    { value: 'general', label: 'General Fund' },
    { value: 'youth-empowerment', label: 'Youth Empowerment Initiative' },
    { value: 'community-health', label: 'Community Health Program' },
    { value: 'environmental-conservation', label: 'Environmental Conservation' },
];

function DonationFormContent() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const preselectedProgram = searchParams.get('program') || 'general';

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50,
      customAmount: '',
      currency: 'USD',
      donationType: 'one-time',
      fullName: '',
      email: '',
      anonymous: false,
      coverFees: false,
      program: preselectedProgram,
    },
  });

  const selectedCurrency = form.watch('currency');
  const selectedAmountValue = form.watch('amount');
  const userEmail = form.watch('email');
  
  const currentCurrencySymbol = getCurrencySymbol(selectedCurrency);
  const suggestedAmounts = getSuggestedAmounts(selectedCurrency);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/donate${preselectedProgram ? `?program=${preselectedProgram}` : ''}`);
    }
    if (user) {
      form.setValue('fullName', user.fullName);
      form.setValue('email', user.email);
    }
    if (preselectedProgram) {
        form.setValue('program', preselectedProgram);
    }
  }, [user, authLoading, router, form, preselectedProgram]);

  useEffect(() => {
    const amounts = getSuggestedAmounts(selectedCurrency);
    if (selectedAmountValue !== -1 && !amounts.includes(selectedAmountValue)) {
      form.setValue('amount', amounts[1]);
    }
  }, [selectedCurrency, form, selectedAmountValue]);

  const getFinalAmount = () => {
    const amount = form.getValues('amount');
    const custom = form.getValues('customAmount');
    return amount === -1 ? parseFloat(custom || "0") : amount;
  }

  const saveDonationToFirebase = async (data: DonationFormValues, finalAmount: number) => {
    if (!user) return null;
    const { firestore: db } = initializeFirebase();
    const docRef = await addDoc(collection(db, 'donations'), {
      userId: user.id,
      userName: user.fullName,
      amount: finalAmount,
      currency: data.currency,
      program: data.program,
      anonymous: data.anonymous,
      type: data.donationType,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };

  const finalAmountForPayment = getFinalAmount();

  const onSuccess = async (reference: any) => {
    const finalAmount = getFinalAmount();
    const id = await saveDonationToFirebase(form.getValues(), finalAmount);
    const params = new URLSearchParams({
        id: id || 'TXN-GEN-' + Date.now(),
        amount: finalAmount.toString(),
        currency: form.getValues('currency'),
        program: form.getValues('program') || 'General',
        name: form.getValues('fullName'),
        ref: reference.reference
    });
    router.push(`/donate/success?${params.toString()}`);
  };

  const onClose = () => {
    setIsProcessing(false);
    toast({ title: 'Payment Cancelled', description: 'The payment window was closed.', variant: 'destructive' });
  };

  // Paystack requires the amount in Kobo (integer)
  const paystackConfig = {
      reference: (new Date()).getTime().toString(),
      email: userEmail || user?.email || '',
      amount: Math.round(finalAmountForPayment * 100),
      publicKey: 'pk_test_37103899889b7cd46aea9603cebc51d0ac7eb860',
      currency: 'NGN'
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSubmit: SubmitHandler<DonationFormValues> = async (data) => {
    setIsProcessing(true);
    const finalAmount = getFinalAmount();

    try {
        if (data.currency === 'USD' || data.currency === 'CAD') {
          const id = await saveDonationToFirebase(data, finalAmount);
          const params = new URLSearchParams({
            id: id || 'TXN-GEN-' + Date.now(),
            amount: finalAmount.toString(),
            currency: data.currency,
            program: data.program || 'General',
            name: data.fullName
          });
          router.push(`/donate/success?${params.toString()}`);
          return;
        }

        if(data.currency === 'NGN') {
          // Initialize Paystack modal
          initializePayment(onSuccess, onClose);
        }
    } catch (error: any) {
        setIsProcessing(false);
        toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <Heart className="mr-2 h-6 w-6 fill-current" /> Support Our Mission
        </CardTitle>
        <CardDescription>Choose your donation amount and currency.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Globe className="mr-2 h-4 w-4" /> Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {currencyOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="program" render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact Area</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {programDedicationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg">Select Amount ({currentCurrencySymbol})</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={v => field.onChange(parseInt(v))} 
                      value={field.value.toString()} 
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {suggestedAmounts.map(amt => (
                        <div key={amt} className="flex items-center">
                          <RadioGroupItem value={amt.toString()} id={`amt-${amt}`} className="peer sr-only" />
                          <Label htmlFor={`amt-${amt}`} className="flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 w-full transition-all hover:bg-muted">
                            <span className="text-xl font-semibold">
                              {currentCurrencySymbol}{amt.toLocaleString()}
                            </span>
                          </Label>
                        </div>
                      ))}
                       <div className="flex items-center">
                          <RadioGroupItem value="-1" id="amt-custom" className="peer sr-only" />
                          <Label htmlFor="amt-custom" className="flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 w-full transition-all hover:bg-muted">
                           <DollarSign className="mb-2 h-6 w-6" /> Custom
                          </Label>
                        </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {selectedAmountValue === -1 && (
              <FormField control={form.control} name="customAmount" render={({ field }) => (
                <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormLabel>Enter Amount ({currentCurrencySymbol})</FormLabel>
                  <FormControl><Input type="number" {...field} autoFocus /></FormControl>
                </FormItem>
              )} />
            )}
            
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
              <FormField control={form.control} name="anonymous" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make my donation anonymous</FormLabel>
                    <FormDescription>Your name will not be shown in public donor lists.</FormDescription>
                  </div>
                </FormItem>
              )} />
            </div>

            <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg"
                disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : selectedCurrency === 'NGN' ? 'Complete with Paystack' : 'Finalize Donation'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function DonatePage() {
  return (
    <SectionWrapper>
      <PageTitle title="Fuel the Stars" subtitle="Your contribution is the spark that creates brighter futures in our community." />
      <Suspense fallback={<div className="flex justify-center items-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <DonationFormContent />
      </Suspense>
    </SectionWrapper>
  );
}
