
import Image from 'next/image';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Image as ImageIcon, FileText, Info } from 'lucide-react';

const galleryImages = [
  { id: '1', src: 'https://placehold.co/600x400.png', alt: 'Community event', dataAiHint: 'community event' },
  { id: '2', src: 'https://placehold.co/600x400.png', alt: 'Volunteers working', dataAiHint: 'volunteers working' },
  { id: '3', src: 'https://placehold.co/600x400.png', alt: 'Happy beneficiary', dataAiHint: 'happy beneficiary' },
  { id: '4', src: 'https://placehold.co/600x400.png', alt: 'Foundation team', dataAiHint: 'foundation team' },
];

const downloadableResources = [
  { id: 'res1', title: 'Annual Report 2023', description: 'Our comprehensive report on activities and financial performance in 2023.', fileType: 'PDF', downloadLink: '#' },
  { id: 'res2', title: 'Foundation Brochure', description: 'An overview of Anointed Star Foundation, our mission, vision, and programs.', fileType: 'PDF', downloadLink: '#' },
  { id: 'res3', title: 'Program Impact Study', description: 'Detailed analysis of the impact of our key programs on communities.', fileType: 'PDF', downloadLink: '#' },
  { id: 'res4', title: 'Brand Logos & Guidelines', description: 'Download our official logos and brand usage guidelines.', fileType: 'ZIP', downloadLink: '#' },
];

const pressKits = [
  { id: 'pk1', title: 'General Press Kit', description: 'Contains an overview of the foundation, key facts, and contact information for media inquiries.', downloadLink: '#' },
  { id: 'pk2', title: 'Youth Empowerment Initiative Press Kit', description: 'Specific information, success stories, and media assets related to our Youth Empowerment Initiative.', downloadLink: '#' },
];

export default function MediaPage() {
  return (
    <>
      <SectionWrapper>
        <PageTitle
          title="Media & Downloads"
          subtitle="Explore our photo gallery, download valuable resources, and access press materials."
        />
      </SectionWrapper>

      {/* Photo Gallery Section */}
      <SectionWrapper className="bg-secondary/50">
        <div className="flex items-center justify-center md:justify-start mb-6">
           <ImageIcon className="h-10 w-10 text-primary mr-4 flex-shrink-0" />
           <h2 className="text-3xl font-semibold text-primary">Photo Gallery</h2>
        </div>
        <p className="text-center md:text-left text-lg text-foreground/80 mb-10 max-w-2xl mx-auto md:mx-0">
            A glimpse into our events, outreach activities, and the communities we serve.
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className="w-full h-64 object-cover"
                data-ai-hint={image.dataAiHint}
              />
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center">{image.alt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Downloadable Resources Section */}
      <SectionWrapper>
        <div className="flex items-center justify-center md:justify-start mb-6">
           <FileText className="h-10 w-10 text-primary mr-4 flex-shrink-0" />
           <h2 className="text-3xl font-semibold text-primary">Downloadable Resources</h2>
        </div>
        <p className="text-center md:text-left text-lg text-foreground/80 mb-10 max-w-2xl mx-auto md:mx-0">
            Access our reports, brochures, and other important documents.
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {downloadableResources.map((resource) => (
            <Card key={resource.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-accent">{resource.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Type: {resource.fileType}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-4">{resource.description}</p>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={resource.downloadLink} download>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Press Kits Section */}
      <SectionWrapper className="bg-primary/10">
        <div className="flex items-center justify-center md:justify-start mb-6">
           <Info className="h-10 w-10 text-primary mr-4 flex-shrink-0" />
           <h2 className="text-3xl font-semibold text-primary">Press Kits</h2>
        </div>
        <p className="text-center md:text-left text-lg text-foreground/80 mb-10 max-w-2xl mx-auto md:mx-0">
            Information and assets for media professionals.
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {pressKits.map((kit) => (
            <Card key={kit.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-accent">{kit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-4">{kit.description}</p>
                <Button asChild className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  <a href={kit.downloadLink} download>
                    <Download className="mr-2 h-4 w-4" /> Download Press Kit
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
