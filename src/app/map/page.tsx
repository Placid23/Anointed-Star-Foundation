import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

export default function MapPage() {
  return (
    <SectionWrapper>
      <PageTitle
        title="Our Areas of Operation"
        subtitle="Visualizing Anointed Star Hub's reach and program locations across various regions."
      />
      
      <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl text-center">
        <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-accent mb-4">Interactive Map Coming Soon!</h2>
        <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
          We are currently developing an interactive map to showcase our program sites and operational areas. 
          This feature will allow you to explore our global footprint and see exactly where we are making a difference.
        </p>
        <p className="text-foreground/80 mb-8 max-w-2xl mx-auto">
          In the meantime, our <a href="/programs" className="text-primary hover:underline">Programs page</a> provides details on the communities we serve.
        </p>
        <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
            <Image 
              src="https://placehold.co/800x450.png" 
              alt="Placeholder map of world with pins" 
              width={800} 
              height={450}
              className="object-cover"
              data-ai-hint="world map pins"
            />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          (Placeholder image of a map)
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This section will feature a map using a library like Vis.GL (<code>@vis.gl/react-google-maps</code>).
        </p>
      </div>
    </SectionWrapper>
  );
}
