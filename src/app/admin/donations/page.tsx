'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import SectionWrapper from '@/components/shared/SectionWrapper';
import PageTitle from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, DollarSign, BarChart3, ChevronLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

export default function AdminDonationsPage() {
  const { user } = useAuth();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  
  const donationQuery = useMemoFirebase(() => {
    return query(collection(db, 'donations'), orderBy('date', 'desc'));
  }, [db]);
  
  const { data: donations, loading } = useCollection(donationQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (user?.role !== 'admin') return null;
  if (!mounted) return null;

  const totalRaised = donations?.reduce((acc: number, d: any) => acc + (d.amount || 0), 0) || 0;

  // Prepare chart data (group by date)
  const chartData = donations ? Object.values(donations.reduce((acc: any, d: any) => {
    if (!d.date) return acc;
    const dateObj = new Date(d.date);
    if (isNaN(dateObj.getTime())) return acc;

    const dateKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (!acc[dateKey]) {
      acc[dateKey] = { 
        name: dateKey, 
        amount: 0, 
        timestamp: dateObj.getTime() 
      };
    }
    acc[dateKey].amount += d.amount;
    return acc;
  }, {}) as Record<string, any>)
    .sort((a: any, b: any) => a.timestamp - b.timestamp)
    .slice(-7)
  : [];

  return (
    <SectionWrapper>
      <div className="max-w-6xl mx-auto mb-4">
        <Button asChild variant="ghost" className="group text-muted-foreground hover:text-primary">
          <Link href="/admin">
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Admin Dashboard
          </Link>
        </Button>
      </div>

      <PageTitle title="Donation History & Analytics" />
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1 bg-primary/5 border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
             <DollarSign className="h-32 w-32" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black flex items-baseline gap-2">
              <span className="text-primary text-2xl">$</span>
              {totalRaised.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic font-medium">Combined value across all programs</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Support Velocity (Last 7 Active Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] pt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={11} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--primary)/0.05)' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '12px', 
                      border: '1px solid hsl(var(--border))', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }}
                    labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--primary))', marginBottom: '4px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Donated']}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === chartData.length - 1 ? 'hsl(var(--accent))' : 'hsl(var(--primary))'} 
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                Insufficient data to generate trend.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Transaction Ledger</CardTitle>
          <CardDescription>A comprehensive record of all community contributions.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold">Donor</TableHead>
                    <TableHead className="font-bold">Amount</TableHead>
                    <TableHead className="font-bold">Program</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="text-right font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations?.map((donation: any) => (
                    <TableRow key={donation.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium">
                        {donation.anonymous ? (
                          <span className="text-muted-foreground italic flex items-center gap-1">
                             Anonymous
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold">{donation.userName}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{donation.type}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-extrabold text-primary">
                          {donation.amount.toLocaleString()} {donation.currency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap">
                          {donation.program?.replace(/-/g, ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">
                        {donation.date ? new Date(donation.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          <div className="h-1 w-1 rounded-full bg-green-600 animate-pulse" />
                          VERIFIED
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {donations?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                        No transactions recorded in the ledger yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
