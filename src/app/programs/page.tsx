'use client';

import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import ProgramCard from '@/components/shared/ProgramCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function ProgramsPage() {
  const db = useFirestore();
  
  const programsQuery = useMemoFirebase(() => {
    return query(collection(db, 'programs'), orderBy('title', 'asc'));
  }, [db]);
  
  const { data: programs, loading } = useCollection(programsQuery);

  return (
    <SectionWrapper>
      <PageTitle
        title="Our Programs"
        subtitle="Explore our initiatives dedicated to empowering communities and creating sustainable impact."
      />
      
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs?.map((program: any, index: number) => (
            <div
              key={program.id}
              className="animate-float-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProgramCard program={program} />
            </div>
          ))}
          {(!programs || programs.length === 0) && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              We are currently finalizing our new program list. Stay tuned!
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  );
}
