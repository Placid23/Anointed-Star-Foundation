
import PageTitle from '@/components/shared/PageTitle';
import ProgramCard from '@/components/shared/ProgramCard';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { programsData } from '@/lib/data';

export default function ProgramsPage() {
  return (
    <SectionWrapper>
      <PageTitle
        title="Our Programs"
        subtitle="Explore the diverse initiatives Anointed Star Foundation offers to empower communities and individuals."
      />
      {programsData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programsData.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-foreground/80">
          No programs available at the moment. Please check back soon!
        </p>
      )}
    </SectionWrapper>
  );
}
