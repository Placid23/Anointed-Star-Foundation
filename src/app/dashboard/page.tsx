
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, LogOut, ShieldCheck, Sparkles, UserCircle, Heart, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

const ADMIN_PASSWORD = '377899';

export default function DashboardPage() {
  const { user, loading, logout, updateRole } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const [adminCode, setAdminCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch user's personal donation history
  const donationQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'donations'),
      where('userId', '==', user.id),
      orderBy('date', 'desc')
    );
  }, [db, user]);

  const { data: donations, loading: donationsLoading } = useCollection(donationQuery);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleClaimAdmin = async () => {
    if (adminCode === ADMIN_PASSWORD) {
      setIsVerifying(true);
      await updateRole('admin');
      setIsVerifying(false);
      setAdminCode('');
    } else {
      toast({
        title: 'Invalid Code',
        description: 'The verification code provided is incorrect.',
        variant: 'destructive',
      });
    }
  };

  if (loading || !user) {
    return (
      <SectionWrapper>
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </SectionWrapper>
    );
  }

  const totalDonated = donations?.reduce((acc, d: any) => acc + (d.amount || 0), 0) || 0;

  return (
    <SectionWrapper>
      <PageTitle title="Your Star Hub" subtitle={`Welcome back, ${user.fullName}!`} />
      
      <div className="max-w-5xl mx-auto grid gap-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="md:col-span-2 shadow-lg border-primary/10">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Profile Details</CardTitle>
                <CardDescription>Verified {user.role} account.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 py-2 border-b">
                <span className="text-muted-foreground font-medium">Full Name</span>
                <span className="text-right font-semibold">{user.fullName}</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b">
                <span className="text-muted-foreground font-medium">Email Address</span>
                <span className="text-right font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <Button onClick={logout} variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
                {user.role === 'admin' && (
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                    <Link href="/admin">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Impact Stats */}
          <Card className="bg-accent text-accent-foreground shadow-lg border-none overflow-hidden relative group">
            <Heart className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-current" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <span className="text-5xl font-extrabold mb-2">${totalDonated}</span>
              <p className="text-sm opacity-80 uppercase tracking-widest font-bold text-center">Total Contributed</p>
            </CardContent>
            <CardFooter>
               <Button asChild variant="secondary" className="w-full">
                  <Link href="/donate">Give More</Link>
               </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Donation History Table */}
        <Card className="shadow-md border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Donation History
            </CardTitle>
            <CardDescription>A record of your contributions to the foundation's mission.</CardDescription>
          </CardHeader>
          <CardContent>
            {donationsLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : donations && donations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((d: any) => (
                    <TableRow key={d.id}>
                      <TableCell className="text-xs">{new Date(d.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-bold text-primary">${d.amount}</TableCell>
                      <TableCell className="capitalize text-xs">{d.program?.replace('-', ' ')}</TableCell>
                      <TableCell>
                         <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">COMPLETED</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                <Heart className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>You haven't made any donations yet.</p>
                <Button asChild variant="link" className="mt-2">
                  <Link href="/donate">Make your first contribution</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Verification Card */}
        {user.role !== 'admin' && (
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Admin Verification
              </CardTitle>
              <CardDescription>
                If you are a foundation administrator but your account is not yet verified, enter your secret code below.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Input 
                type="password" 
                placeholder="Enter admin code" 
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="max-w-[200px]"
              />
              <Button 
                onClick={handleClaimAdmin} 
                disabled={!adminCode || isVerifying}
                className="bg-accent hover:bg-accent/90"
              >
                {isVerifying ? <Loader2 className="animate-spin h-4 w-4" /> : 'Verify Status'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </SectionWrapper>
  );
}
