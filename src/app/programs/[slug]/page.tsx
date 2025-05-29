import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { getProgramBySlug, programsData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MapPin } from 'lucide-react';

type ProgramDetailPageProps = {
  params: { slug: string };
};

// export async function generateStaticParams() {
//   return programsData.map((program) => ({
//     slug: program.slug,
//   }));
// }

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const program = getProgramBySlug(params.slug);

  if (!program) {
    notFound();
  }

  return (
    <SectionWrapper>
      <PageTitle title={program.title} />
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div>
          <Image
            src={program.imageUrl}
            alt={program.title}
            width={800}
            height={600}
            className="rounded-lg shadow-xl object-cover w-full"
            data-ai-hint={program.dataAiHint}
          />
        </div>
        <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed">
          <h2 className="text-2xl font-semibold text-primary mb-3">Program Overview</h2>
          <p>{program.longDescription}</p>
          {program.location && (
            <div className="mt-6 p-4 border border-border rounded-lg bg-secondary/30">
              <h3 className="text-lg font-semibold text-primary flex items-center mb-2">
                <MapPin className="mr-2 h-5 w-5" /> Program Location
              </h3>
              <p className="text-foreground/80">{program.location.name}</p>
              {/* Placeholder for map integration */}
              <p className="text-sm text-muted-foreground mt-1">(Lat: {program.location.lat}, Lng: {program.location.lng})</p>
            </div>
          )}
        </div>
      </div>

      {program.updates && program.updates.length > 0 && (
        <Card className="mb-12 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {program.updates.map((update, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-foreground/80">{update}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/donate?program=${program.slug}">Support This Program</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="ml-4">
          <Link href="/programs">Back to All Programs</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
