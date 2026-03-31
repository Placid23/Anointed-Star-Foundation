
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
import { Loader2, LogOut, ShieldCheck, Sparkles, UserCircle, Heart, History, Star, ArrowRight, Bookmark } from 'lucide-react';
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
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

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

  // Fetch all programs to resolve favorites and recent history
  const allProgramsQuery = useMemoFirebase(() => collection(db, 'programs'), [db]);
  const { data: allPrograms } = useCollection(allProgramsQuery);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    
    // Load recent history from local storage
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('recent_programs') || '[]');
      setRecentSlugs(history);
    }
  }, [user, loading, router]);

  const handleClaimAdmin = async () => {
    if (adminCode === ADMIN_PASSWORD) {
      setIsVerifying(true);
      await updateRole('admin');
      setIsVerifying(false);
      setAdminCode('');
    } else {
      toast({ title: 'Invalid Code', variant: 'destructive' });
    }
  };

  if (loading || !user) {
    return (
      <SectionWrapper>
        <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-12 w-12 text-primary animate-spin" /></div>
      </SectionWrapper>
    );
  }

  const totalDonated = donations?.reduce((acc, d: any) => acc + (d.amount || 0), 0) || 0;
  
  // Calculate Supporter Tier
  let tier = { name: 'Star Supporter', color: 'text-white', icon: Star };
  if (totalDonated > 2500) tier = { name: 'Celestial Benefactor', color: 'text-accent', icon: Sparkles };
  else if (totalDonated > 500) tier = { name: 'Guardian Star', color: 'text-yellow-400', icon: ShieldCheck };

  const favoritePrograms = allPrograms?.filter(p => user.favorites?.includes(p.slug)) || [];
  const recentPrograms = allPrograms?.filter(p => recentSlugs.includes(p.slug)).slice(0, 3) || [];

  return (
    <SectionWrapper>
      <PageTitle title="Star Hub Dashboard" subtitle={`Welcome, ${user.fullName.split(' ')[0]}!`} />
      
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Status & Tier Card */}
          <Card className="glass border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
               <tier.icon className="h-32 w-32" />
            </div>
            <CardHeader>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${tier.color} text-[10px] font-black uppercase tracking-widest`}>
                <tier.icon className="h-3 w-3" />
                {tier.name}
              </div>
              <CardTitle className="text-3xl font-black text-white mt-4">${totalDonated.toLocaleString()}</CardTitle>
              <CardDescription className="text-white/40 uppercase text-[10px] font-bold tracking-tighter">Total Lifetime Impact</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${Math.min((totalDonated/5000)*100, 100)}%` }} />
               </div>
               <p className="text-[10px] text-white/30 mt-2 font-medium">Next Milestone: Celestial Benefactor ($5,000)</p>
            </CardContent>
            <CardFooter>
               <Button asChild className="w-full gradient-gold text-accent-foreground font-black rounded-xl">
                  <Link href="/donate">Boost Your Impact</Link>
               </Button>
            </CardFooter>
          </Card>

          {/* Account Profile Card */}
          <Card className="lg:col-span-2 glass border-white/5 flex flex-col md:flex-row">
            <div className="p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
               <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 mb-4">
                  <UserCircle className="h-12 w-12 text-primary" />
               </div>
               <h3 className="font-black text-white text-center">{user.fullName}</h3>
               <p className="text-xs text-white/40">{user.email}</p>
            </div>
            <div className="p-8 flex-1 space-y-4">
               <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Access Level</span>
                  <span className="text-accent font-black capitalize">{user.role}</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Star Since</span>
                  <span className="text-white/80 font-medium">March 2024</span>
               </div>
               <div className="pt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg border-white/10 text-white/60 hover:text-white" onClick={logout}>
                    <LogOut className="mr-2 h-3 w-3" /> Sign Out
                  </Button>
                  {user.role === 'admin' && (
                    <Button asChild size="sm" className="rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                      <Link href="/admin"><ShieldCheck className="mr-2 h-3 w-3" /> Control Panel</Link>
                    </Button>
                  )}
               </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Saved Programs */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-accent" /> Saved Initiatives
            </h2>
            {favoritePrograms.length > 0 ? (
              <div className="grid gap-4">
                {favoritePrograms.map(p => (
                  <Card key={p.id} className="glass border-white/5 hover:border-white/10 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-white/10">
                        <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                        <p className="text-[10px] text-white/40 truncate">{p.shortDescription}</p>
                      </div>
                      <Button asChild variant="ghost" size="icon" className="text-white/40 hover:text-accent">
                        <Link href={`/programs/${p.slug}`}><ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center glass border-white/5 rounded-3xl">
                <Bookmark className="h-8 w-8 text-white/10 mx-auto mb-2" />
                <p className="text-sm text-white/30 italic">No saved programs yet.</p>
              </div>
            )}
          </div>

          {/* Recent History */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Recently Viewed
            </h2>
            <div className="grid gap-4">
              {recentPrograms.map(p => (
                <Link key={p.id} href={`/programs/${p.slug}`}>
                  <Card className="glass border-white/5 hover:bg-white/[0.02] transition-colors border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                      <p className="text-[10px] text-white/40">{p.location?.name || 'Global Initiative'}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {recentPrograms.length === 0 && (
                <p className="text-sm text-white/30 italic p-12 text-center glass border-white/5 rounded-3xl">
                  Programs you visit will appear here.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <Card className="glass border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Contribution Ledger
            </CardTitle>
            <CardDescription className="text-white/40">A secure record of your verified donations.</CardDescription>
          </CardHeader>
          <CardContent>
            {donationsLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : donations && donations.length > 0 ? (
              <div className="rounded-xl border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow>
                      <TableHead className="text-white/60 font-black text-[10px] uppercase">Date</TableHead>
                      <TableHead className="text-white/60 font-black text-[10px] uppercase">Amount</TableHead>
                      <TableHead className="text-white/60 font-black text-[10px] uppercase">Impact Area</TableHead>
                      <TableHead className="text-right text-white/60 font-black text-[10px] uppercase">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((d: any) => (
                      <TableRow key={d.id} className="hover:bg-white/[0.02]">
                        <TableCell className="text-xs text-white/80">{new Date(d.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-black text-accent">${d.amount}</TableCell>
                        <TableCell className="capitalize text-xs text-white/60">{d.program?.replace('-', ' ')}</TableCell>
                        <TableCell className="text-right">
                           <Button asChild variant="link" size="sm" className="text-primary hover:text-primary/80 font-bold text-[10px]">
                              <Link href={`/donate/success?amount=${d.amount}&currency=${d.currency}&program=${d.program}&id=${d.id}&name=${user.fullName}`}>VIEW RECEIPT</Link>
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-white/30 italic">No transactions recorded yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Admin Secret Entry */}
        {user.role !== 'admin' && (
          <Card className="border border-dashed border-primary/20 bg-primary/5 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Foundation Console
              </CardTitle>
              <CardDescription>Administrative access requires a secure verification key.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Input 
                type="password" 
                placeholder="Access Key" 
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="max-w-[200px] glass border-white/10 text-white"
              />
              <Button onClick={handleClaimAdmin} disabled={!adminCode || isVerifying} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg px-8">
                {isVerifying ? <Loader2 className="animate-spin h-4 w-4" /> : 'Enter Console'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </SectionWrapper>
  );
}
