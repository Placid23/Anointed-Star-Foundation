import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { getNewsBySlug, newsArticlesData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, UserCircle, ArrowLeft } from 'lucide-react';

type NewsDetailPageProps = {
  params: { slug: string };
};

// export async function generateStaticParams() {
//   return newsArticlesData.map((article) => ({
//     slug: article.slug,
//   }));
// }

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = getNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <SectionWrapper>
      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/news" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 tracking-tight">{article.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              Published on {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center">
              <UserCircle className="mr-1.5 h-4 w-4" />
              By {article.author}
            </div>
          </div>
        </div>

        <Image
          src={article.imageUrl}
          alt={article.title}
          width={800}
          height={450}
          className="rounded-lg shadow-lg object-cover w-full mb-8"
          data-ai-hint={article.dataAiHint}
        />

        <div 
          className="prose prose-lg max-w-none text-foreground/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-foreground/80 mb-4">Enjoyed this article? Share it with your network!</p>
          {/* Placeholder for social share buttons */}
          <Button variant="outline" className="mr-2">Share on X</Button>
          <Button variant="outline">Share on Facebook</Button>
        </div>
      </article>
    </SectionWrapper>
  );
}
