'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
    CheckCircle2, 
    Printer, 
    Award, 
    Sparkles, 
    ShieldCheck, 
    Calendar, 
    Hash,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    const amount = searchParams.get('amount') || '0';
    const currency = searchParams.get('currency') || 'USD';
    const program = searchParams.get('program')?.replace(/-/g, ' ') || 'General Fund';
    const name = searchParams.get('name') || 'Valued Supporter';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        setMounted(true);
        const existingId = searchParams.get('id');
        if (existingId) {
            setTransactionId(existingId);
        } else {
            // Generate ID only on client to avoid hydration mismatch
            setTransactionId('TXN-' + Math.random().toString(36).substring(7).toUpperCase());
        }

        if (!amount || amount === '0') {
            router.push('/donate');
        }
    }, [amount, router, searchParams]);

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600 animate-bounce" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">
                    Thank You, {name.split(' ')[0]}!
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                    Your contribution of <span className="text-primary font-bold">{currency} {parseFloat(amount).toLocaleString()}</span> has been successfully processed. 
                    You've just lit a new star in our community.
                </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6 animate-in slide-in-from-left duration-700 delay-200">
                    <Card className="shadow-xl border-primary/20 bg-card overflow-hidden">
                        <div className="bg-primary h-2" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Donation Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Hash className="h-3 w-3" /> Transaction ID
                                </span>
                                <span className="font-mono font-bold text-xs bg-muted px-2 py-1 rounded">{transactionId}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Date
                                </span>
                                <span className="font-semibold">{date}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-start py-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Allocated To</p>
                                    <p className="font-bold text-primary capitalize">{program}</p>
                                </div>
                            </div>
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-black">Final Amount</p>
                                <div className="text-3xl font-black flex items-baseline gap-2">
                                    <span className="text-primary text-xl">{currency}</span>
                                    {parseFloat(amount).toLocaleString()}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold bg-green-50 p-2 rounded border border-green-100">
                                <ShieldCheck className="h-3 w-3" />
                                SECURE TRANSACTION VERIFIED
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/30 border-t flex flex-col gap-2 p-4">
                            <Button onClick={handlePrint} className="w-full bg-accent hover:bg-accent/90" size="lg">
                                <Printer className="mr-2 h-4 w-4" /> Download Receipt PDF
                            </Button>
                        </CardFooter>
                    </Card>

                    <Button asChild variant="ghost" className="w-full group">
                        <Link href="/dashboard">
                            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="lg:col-span-3 animate-in slide-in-from-right duration-700 delay-300">
                    <div 
                        ref={printRef}
                        className="relative bg-white border-[12px] border-double border-primary/30 p-8 md:p-12 text-center rounded-sm shadow-2xl print:border-primary print:shadow-none"
                    >
                        <div className="absolute top-4 left-4 border-t-2 border-l-2 border-primary w-8 h-8 opacity-40" />
                        <div className="absolute top-4 right-4 border-t-2 border-r-2 border-primary w-8 h-8 opacity-40" />
                        <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-primary w-8 h-8 opacity-40" />
                        <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-primary w-8 h-8 opacity-40" />

                        <div className="flex flex-col items-center">
                            <Award className="h-20 w-20 text-accent mb-6 animate-pulse" />
                            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground mb-4">Anointed Foundation Certificate</h2>
                            <h3 className="text-4xl font-serif font-black text-primary mb-8 italic">Star Supporter</h3>
                            
                            <p className="text-lg text-foreground/80 leading-relaxed max-w-md mx-auto mb-10">
                                This is to officially recognize and thank <br />
                                <span className="text-2xl font-bold text-foreground block my-4 underline decoration-accent/30 underline-offset-8">
                                    {name}
                                </span>
                                for their generous contribution of <span className="font-bold text-primary">{currency} {parseFloat(amount).toLocaleString()}</span> towards the <span className="font-bold italic text-primary">{program}</span>.
                            </p>

                            <div className="grid grid-cols-2 gap-12 w-full max-w-sm mt-8 border-t border-muted pt-8">
                                <div className="space-y-2">
                                    <div className="h-px bg-muted-foreground/30 w-full mb-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Date Issued</p>
                                    <p className="text-sm font-serif">{date}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-px bg-muted-foreground/30 w-full mb-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Director Signature</p>
                                    <p className="text-sm font-serif italic font-bold">Dr. Stella Placid</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                            <Image 
                                src="/anointed-star-hub-logo.jpg.jpeg" 
                                alt="Logo Watermark" 
                                width={500} 
                                height={500} 
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DonationSuccessPage() {
    return (
        <SectionWrapper className="bg-secondary/20 min-h-screen">
            <Suspense fallback={
                <div className="flex justify-center items-center py-40">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </SectionWrapper>
    );
}
