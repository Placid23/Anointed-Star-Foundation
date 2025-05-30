
import PageTitle from '@/components/shared/PageTitle';
import NewsCard from '@/components/shared/NewsCard';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { newsArticlesData } from '@/lib/data';

export default function NewsPage() {
  return (
    <SectionWrapper>
      <PageTitle
        title="News & Blog"
        subtitle="Stay updated with the latest happenings, stories, and insights from Anointed Star Foundation."
      />
      {newsArticlesData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticlesData.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-foreground/80">
          No news articles available at the moment. Please check back soon!
        </p>
      )}
    </SectionWrapper>
  );
}
