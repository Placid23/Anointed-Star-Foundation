'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SectionWrapper from '@/components/shared/SectionWrapper';
import PageTitle from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Newspaper, 
  FolderHeart, 
  Info, 
  ReceiptText, 
  MessageSquare, 
  Sparkles, 
  Users, 
  TrendingUp,
  ArrowRight,
  UserCircle,
  Heart
} from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const db = useFirestore();

  const newsRef = useMemoFirebase(() => collection(db, 'news'), [db]);
  const donationsRef = useMemoFirebase(() => collection(db, 'donations'), [db]);
  const programsRef = useMemoFirebase(() => collection(db, 'programs'), [db]);
  const feedbackRef = useMemoFirebase(() => collection(db, 'feedback'), [db]);
  const leadershipRef = useMemoFirebase(() => collection(db, 'leadership'), [db]);

  const { data: news } = useCollection(newsRef);
  const { data: donations } = useCollection(donationsRef);
  const { data: programs } = useCollection(programsRef);
  const { data: feedback } = useCollection(feedbackRef);
  const { data: leadership } = useCollection(leadershipRef);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return null;
  }

  const totalRevenue = donations?.reduce((acc: number, d: any) => acc + (d.amount || 0), 0) || 0;

  const stats = [
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: Heart, color: 'text-red-500' },
    { title: 'Articles', value: news?.length || 0, icon: Newspaper, color: 'text-blue-500' },
    { title: 'Programs', value: programs?.length || 0, icon: FolderHeart, color: 'text-pink-500' },
    { title: 'Messages', value: feedback?.length || 0, icon: MessageSquare, color: 'text-orange-500' },
  ];

  const adminModules = [
    { title: 'Manage News', icon: Newspaper, href: '/admin/news', desc: 'Publish stories and blog updates.' },
    { title: 'Manage Programs', icon: FolderHeart, href: '/admin/programs', desc: 'Update initiatives and project details.' },
    { title: 'About Content', icon: Info, href: '/admin/about', desc: 'Update foundation mission and history.' },
    { title: 'Leadership Team', icon: Users, href: '/admin/leadership', desc: 'Manage the foundation leadership roster.' },
    { title: 'Donation Records', icon: ReceiptText, href: '/admin/donations', desc: 'View transactions and analytics.' },
    { title: 'User Feedback', icon: MessageSquare, href: '/admin/feedback', desc: 'Review messages from the community.' },
    { title: 'AI Proposal Tool', icon: Sparkles, href: '/proposal-generator', desc: 'Generate personalized donor appeals.' },
  ];

  return (
    <SectionWrapper>
      <PageTitle 
        title="Admin Control Center" 
        subtitle="Welcome back, Administrator. Here is an overview of the foundation's performance." 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} className="border-primary/10 shadow-sm hover:border-primary transition-colors">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-muted/50`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
          <TrendingUp className="h-6 w-6" /> Management Modules
        </h2>
        <p className="text-xs text-muted-foreground font-mono">SECURE ADMIN SESSION ACTIVE</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => (
          <Card key={module.href} className="group hover:shadow-md transition-all border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <module.icon className="h-12 w-12" />
            </div>
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <module.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full justify-between hover:text-primary hover:bg-primary/5">
                <Link href={module.href}>
                  Open Module <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
