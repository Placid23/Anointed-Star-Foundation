
'use client';

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
import { CreditCard, Heart, DollarSign, RefreshCw, Globe } from 'lucide-react';
// programsData is not directly used for dedication options now, but might be useful for other context.
// import { programsData } from '@/lib/data';

const donationSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Donation amount must be positive.' }),
  customAmount: z.string().optional(),
  currency: z.string().min(3, { message: 'Please select a currency.' }),
  donationType: z.enum(['one-time', 'recurring'], { required_error: 'Please select a donation type.' }),
  program: z.string().optional(),
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  anonymous: z.boolean().default(false),
  coverFees: z.boolean().default(false),
});

type DonationFormValues = z.infer<typeof donationSchema>;

const suggestedAmounts = [25, 50, 100, 250, 500];
const currencyOptions = [
  { value: 'USD', label: 'USD - United States Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound Sterling' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
];

const programDedicationOptions = [
    { value: 'general', label: 'General Fund' },
    { value: 'youth-empowerment', label: 'Children Empowerment Initiative' },
    { value: 'community-health', label: 'Community Health Program' },
    { value: 'environmental-conservation', label: 'Social Conservation Project' },
];

export default function DonatePage() {
  const { toast } = useToast();
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50,
      currency: 'USD',
      donationType: 'one-time',
      firstName: '',
      lastName: '',
      email: '',
      anonymous: false,
      coverFees: false,
    },
  });

  const selectedAmount = form.watch('amount');
  // const customAmountVal = form.watch('customAmount'); // Not directly used in logic, but good for debugging if needed

  const onSubmit: SubmitHandler<DonationFormValues> = (data) => {
    const finalAmount = data.amount === -1 && data.customAmount ? parseFloat(data.customAmount) : data.amount;
    
    if (data.amount === -1 && (isNaN(finalAmount) || finalAmount <= 0) ) {
        form.setError("customAmount", { type: "manual", message: "Please enter a valid custom amount." });
        return;
    } else if (data.amount !== -1 && finalAmount <=0) {
        form.setError("amount", { type: "manual", message: "Amount must be positive."});
        return;
    }

    console.log({ ...data, amount: finalAmount, currency: data.currency });
    // Placeholder for payment gateway integration & tax receipt
    toast({
      title: 'Thank You for Your Generosity!',
      description: `Your ${data.donationType} donation of ${data.currency} ${finalAmount} is being processed.`,
    });
    form.reset();
  };

  return (
    <SectionWrapper>
      <PageTitle
        title="Support Anointed Star Foundation"
        subtitle="Your contribution empowers us to continue our vital work. Every donation, big or small, makes a difference."
      />
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <Heart className="mr-2 h-6 w-6" /> Make a Donation
          </CardTitle>
          <CardDescription>Choose your donation amount, currency, and frequency.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Currency Selection */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg flex items-center"><Globe className="mr-2 h-5 w-5 text-muted-foreground" /> Select Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencyOptions.map(currency => (
                            <SelectItem key={currency.value} value={currency.value}>{currency.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount Selection */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg">Select Amount (in chosen currency)</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                      >
                        {suggestedAmounts.map((amt) => (
                          <FormItem key={amt} className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value={amt.toString()} id={`amount-${amt}`} className="peer sr-only" />
                            </FormControl>
                            <FormLabel
                              htmlFor={`amount-${amt}`}
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer"
                            >
                              <DollarSign className="mb-2 h-6 w-6" />{amt}
                            </FormLabel>
                          </FormItem>
                        ))}
                         <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="-1" id="amount-custom" className="peer sr-only" />
                            </FormControl>
                            <FormLabel
                              htmlFor="amount-custom"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer"
                            >
                              <DollarSign className="mb-2 h-6 w-6" />Custom
                            </FormLabel>
                          </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedAmount === -1 && (
                 <FormField
                    control={form.control}
                    name="customAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Custom Amount (in chosen currency)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Enter amount" {...field} step="any" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
              )}

              {/* Donation Type */}
              <FormField
                control={form.control}
                name="donationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg">Donation Frequency</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="one-time" id="one-time" />
                          </FormControl>
                          <Label htmlFor="one-time" className="font-normal cursor-pointer">One-Time</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="recurring" id="recurring" />
                          </FormControl>
                          <Label htmlFor="recurring" className="font-normal cursor-pointer flex items-center"><RefreshCw className="mr-1 h-4 w-4"/>Monthly</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Program Selection (Optional) */}
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dedicate my donation to (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a program (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programDedicationOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      If not specified, your donation will support our general fund.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Personal Information */}
              <div className="space-y-3">
                 <h3 className="text-lg font-medium">Personal Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 </div>
                 <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              {/* Options */}
              <div className="space-y-3">
                <FormField
                    control={form.control}
                    name="anonymous"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel>Make my donation anonymous</FormLabel>
                        </div>
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="coverFees"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel>I'd like to cover the transaction fees</FormLabel>
                        <FormDescription>Help us maximize your gift by covering processing fees.</FormDescription>
                        </div>
                    </FormItem>
                    )}
                />
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Payment processing will be handled securely. Tax receipts will be issued for eligible donations.
                </p>
                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}

