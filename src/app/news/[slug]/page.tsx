'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, UserCircle, ArrowLeft, Loader2, Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const db = useFirestore();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the query to prevent infinite render loops
  const newsQuery = useMemoFirebase(() => {
    return query(collection(db, 'news'), where('slug', '==', slug), limit(1));
  }, [db, slug]);
  
  const { data, loading: collectionLoading } = useCollection(newsQuery);

  useEffect(() => {
    if (!collectionLoading) {
      if (data && data.length > 0) {
        setArticle(data[0]);
      } else {
        setArticle(null);
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

  if (!article) {
    notFound();
  }

  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto mb-6">
        <Button asChild variant="ghost" className="group -ml-4 text-muted-foreground hover:text-primary transition-colors">
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to News Feed
          </Link>
        </Button>
      </div>

      <article className="max-w-4xl mx-auto">
        <PageTitle title={article.title} />

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
          <div className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>By {article.author}</span>
          </div>
        </div>

        <div className="mb-8 relative aspect-video overflow-hidden rounded-lg shadow-xl">
          <Image
            src={article.imageUrl || 'https://picsum.photos/seed/placeholder/800/600'}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div
          className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="text-center mt-12 pt-8 border-t">
          <Button asChild variant="outline" size="lg" className="group border-primary/20 hover:border-primary hover:bg-primary/5">
            <Link href="/news">
              <Undo2 className="mr-2 h-5 w-5 transition-transform group-hover:rotate-[-45deg]" />
              Explore More Stories
            </Link>
          </Button>
        </div>
      </article>
    </SectionWrapper>
  );
}
