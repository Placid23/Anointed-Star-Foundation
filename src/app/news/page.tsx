'use client';

import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import NewsCard from '@/components/shared/NewsCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function NewsPage() {
  const db = useFirestore();
  
  const newsQuery = useMemoFirebase(() => {
    return query(collection(db, 'news'), orderBy('date', 'desc'));
  }, [db]);
  
  const { data: news, loading } = useCollection(newsQuery);

  return (
    <SectionWrapper>
      <PageTitle
        title="Latest News & Updates"
        subtitle="Stay informed with the latest happenings, stories, and announcements from Anointed Foundation."
      />
      
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {news?.map((article: any, index: number) => (
            <div
              key={article.id}
              className="animate-float-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <NewsCard article={article} />
            </div>
          ))}
          {(!news || news.length === 0) && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No news articles found at the moment. Please check back later.
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  );
}
