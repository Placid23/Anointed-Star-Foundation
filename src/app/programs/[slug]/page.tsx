
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Loader2, Heart, MoveLeft, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const db = useFirestore();
  const { user, toggleFavorite } = useAuth();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const programsQuery = useMemoFirebase(() => {
    return query(collection(db, 'programs'), where('slug', '==', slug), limit(1));
  }, [db, slug]);

  const { data, loading: collectionLoading } = useCollection(programsQuery);

  useEffect(() => {
    if (!collectionLoading) {
      if (data && data.length > 0) {
        setProgram(data[0]);
        // Track recently viewed in local storage
        const history = JSON.parse(localStorage.getItem('recent_programs') || '[]');
        const updatedHistory = [slug, ...history.filter((s: string) => s !== slug)].slice(0, 5);
        localStorage.setItem('recent_programs', JSON.stringify(updatedHistory));
      } else {
        setProgram(null);
      }
      setLoading(false);
    }
  }, [data, collectionLoading, slug]);

  if (loading) {
    return (
      <SectionWrapper>
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
      </SectionWrapper>
    );
  }

  if (!program) notFound();

  const isFavorited = user?.favorites?.includes(slug);

  return (
    <SectionWrapper>
      <div className="max-w-6xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4">
        <Button asChild variant="ghost" className="group text-muted-foreground hover:text-primary -ml-4">
          <Link href="/programs">
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
            Back to Programs
          </Link>
        </Button>
        
        <Button 
          variant={isFavorited ? "secondary" : "outline"} 
          className={`rounded-full gap-2 ${isFavorited ? 'border-accent text-accent' : ''}`}
          onClick={() => toggleFavorite(slug)}
        >
          <Star className={`h-4 w-4 ${isFavorited ? 'fill-accent' : ''}`} />
          {isFavorited ? 'Saved to Favorites' : 'Save to Profile'}
        </Button>
      </div>

      <PageTitle title={program.title} />
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div className="relative aspect-square md:aspect-auto md:h-[400px] overflow-hidden rounded-[2rem] shadow-2xl border border-white/5">
          <Image
            src={program.imageUrl || 'https://picsum.photos/seed/placeholder-program/800/600'}
            alt={program.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-40" />
        </div>
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-accent mb-4">The Vision</h2>
          <p className="text-white/80 leading-relaxed">{program.longDescription}</p>
          
          {program.location?.name && (
            <div className="mt-8 p-6 glass rounded-2xl border-white/5">
              <h3 className="text-lg font-black text-white flex items-center mb-2 uppercase tracking-widest text-[10px]">
                <MapPin className="mr-2 h-4 w-4 text-accent" /> Program Hub
              </h3>
              <p className="text-white/60 font-medium">{program.location.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center glass p-8 md:p-16 rounded-[3rem] mb-12 border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Heart className="h-64 w-64 text-accent" />
        </div>
        <Heart className="h-16 w-16 text-accent mx-auto mb-6 animate-pulse" />
        <h3 className="text-3xl font-black text-white mb-4">Support {program.title}</h3>
        <p className="text-white/60 mb-10 max-w-2xl mx-auto text-lg">
          Your contribution specifically funds the equipment, education, and personnel needed to keep this initiative moving forward.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Button asChild size="lg" className="h-14 px-10 gradient-gold text-accent-foreground font-black rounded-full shadow-xl hover:scale-105 transition-transform">
            <Link href={`/donate?program=${program.slug}`}>Invest in this Mission</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-10 glass border-white/20 text-white rounded-full">
            <Link href="/programs">Explore More initiatives</Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
