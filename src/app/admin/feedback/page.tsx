'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import SectionWrapper from '@/components/shared/SectionWrapper';
import PageTitle from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Mail, Calendar, MessageSquare, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminFeedbackPage() {
  const { user } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  const feedbackQuery = useMemoFirebase(() => {
    return query(collection(db, 'feedback'), orderBy('submittedAt', 'desc'));
  }, [db]);
  
  const { data: feedback, loading } = useCollection(feedbackQuery);

  if (user?.role !== 'admin') return null;

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'feedback', id));
      toast({ title: 'Feedback removed' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto mb-4">
        <Button asChild variant="ghost" className="group text-muted-foreground hover:text-primary">
          <Link href="/admin">
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Admin Dashboard
          </Link>
        </Button>
      </div>

      <PageTitle title="Community Feedback" subtitle="Listen to what your supporters and visitors are saying." />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
        ) : feedback && feedback.length > 0 ? (
          feedback.map((item: any) => (
            <Card key={item.id} className="shadow-sm border-primary/10 hover:border-primary/30 transition-all">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {item.userEmail || 'Guest User'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.submittedAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                  "{item.content}"
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-20">
            <CardContent>
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No feedback messages yet. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </SectionWrapper>
  );
}
