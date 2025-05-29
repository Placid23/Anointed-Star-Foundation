import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NewsArticle } from '@/lib/types';
import { ArrowRight, CalendarDays, UserCircle } from 'lucide-react';

type NewsCardProps = {
  article: NewsArticle;
};

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={article.dataAiHint}
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 text-primary">{article.title}</CardTitle>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
          <div className="flex items-center">
            <CalendarDays className="mr-1 h-3 w-3" />
            {new Date(article.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <UserCircle className="mr-1 h-3 w-3" />
            {article.author}
          </div>
        </div>
        <CardDescription className="text-foreground/80 line-clamp-3">{article.summary}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" className="w-full group">
          <Link href={`/news/${article.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
