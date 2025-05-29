import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Program } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

type ProgramCardProps = {
  program: Program;
};

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:border-primary">
      <CardHeader className="p-0">
        <Image
          src={program.imageUrl}
          alt={program.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={program.dataAiHint}
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 text-primary">{program.title}</CardTitle>
        <CardDescription className="text-foreground/80 line-clamp-3">{program.shortDescription}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" className="w-full group">
          <Link href={`/programs/${program.slug}`}>
            Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
