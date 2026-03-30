'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MapPin, Loader2, Heart, ArrowLeft, MoveLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const db = useFirestore();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the query to prevent infinite render loops
  const programsQuery = useMemoFirebase(() => {
    return query(collection(db, 'programs'), where('slug', '==', slug), limit(1));
  }, [db, slug]);

  const { data, loading: collectionLoading } = useCollection(programsQuery);

  useEffect(() => {
    if (!collectionLoading) {
      if (data && data.length > 0) {
        setProgram(data[0]);
      } else {
        setProgram(null);
      }
      setLoading(false);
    }
  }, [data, collectionLoading]);

  if (loading) {
    return (
      <SectionWrapper>
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
      </SectionWrapper>
    );
  }

  if (!program) {
    notFound();
  }

  return (
    <SectionWrapper>
      <div className="max-w-6xl mx-auto mb-8">
        <Button asChild variant="ghost" className="group text-muted-foreground hover:text-primary -ml-4">
          <Link href="/programs">
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
            Back to Programs
          </Link>
        </Button>
      </div>

      <PageTitle title={program.title} />
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div className="relative aspect-square md:aspect-auto md:h-[400px] overflow-hidden rounded-lg shadow-xl">
          <Image
            src={program.imageUrl || 'https://picsum.photos/seed/placeholder-program/800/600'}
            alt={program.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed">
          <h2 className="text-2xl font-semibold text-primary mb-3">Program Overview</h2>
          <p>{program.longDescription}</p>
          {program.location?.name && (
            <div className="mt-6 p-4 border border-border rounded-lg bg-secondary/30">
              <h3 className="text-lg font-semibold text-primary flex items-center mb-2">
                <MapPin className="mr-2 h-5 w-5" /> Program Location
              </h3>
              <p className="text-foreground/80">{program.location.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center bg-primary/10 p-10 rounded-2xl mb-12 border-2 border-dashed border-primary/30">
        <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-primary mb-4">Would you like to support {program.title}?</h3>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Your donation goes directly towards funding the specific goals and activities of this initiative. Every contribution counts.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all">
            <Link href={`/donate?program=${program.slug}`}>Donate to this Program</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/programs">
              Explore More Programs
            </Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
