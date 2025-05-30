
import Image from 'next/image';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { leadershipData } from '@/lib/data';
import { Target, Eye, Milestone, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <SectionWrapper>
        <PageTitle
          title="About Anointed Star Foundation"
          subtitle="Dedicated to empowering individuals and fostering sustainable community development."
        />
      </SectionWrapper>

      <SectionWrapper className="bg-secondary/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-float-in" style={{ animationDelay: '0.1s' }}>
            <Image
              src="https://placehold.co/600x400.png"
              alt="Foundation team working together"
              width={600}
              height={400}
              className="rounded-lg shadow-xl object-cover"
              data-ai-hint="team collaboration"
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-start group animate-float-in" style={{ animationDelay: '0.2s' }}>
              <Target className="h-10 w-10 text-primary mr-4 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:animate-icon-pulse-subtle" />
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Our Mission</h2>
                <p className="text-foreground/90 leading-relaxed">
                  To empower underserved communities through comprehensive programs in education, health, and economic development, fostering self-reliance and creating lasting positive change.
                </p>
              </div>
            </div>
            <div className="flex items-start group animate-float-in" style={{ animationDelay: '0.3s' }}>
              <Eye className="h-10 w-10 text-primary mr-4 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:animate-icon-pulse-subtle" />
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Our Vision</h2>
                <p className="text-foreground/90 leading-relaxed">
                  We envision a world where every individual has the opportunity to reach their full potential, live with dignity, and contribute meaningfully to society.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="flex items-start group mb-6 animate-float-in" style={{ animationDelay: '0.1s' }}>
           <Milestone className="h-10 w-10 text-primary mr-4 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:animate-icon-bounce" />
            <div>
              <h2 className="text-3xl font-semibold text-primary md:text-left">Our History</h2>
            </div>
        </div>
        <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-4">
          <p className="animate-float-in" style={{ animationDelay: '0.2s' }}>
            Founded in 2010 by a group of passionate individuals, Anointed Star Foundation began as a small initiative to address local educational disparities. Over the years, driven by community needs and the unwavering support of our partners and donors, we have expanded our scope and reach.
          </p>
          <p className="animate-float-in" style={{ animationDelay: '0.3s' }}>
            From humble beginnings, we have grown into a multifaceted foundation impacting thousands of lives annually. Key milestones include the launch of our flagship Youth Empowerment Initiative in 2012, the establishment of our first Community Health Clinic in 2015, and the expansion of our programs to three new regions by 2020.
          </p>
          <p className="animate-float-in" style={{ animationDelay: '0.4s' }}>
            Our journey has been one of continuous learning, adaptation, and a deep commitment to the communities we serve. We are proud of our achievements but remain focused on the challenges ahead, always striving to innovate and enhance our impact.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-primary/10">
        <div className="flex items-center justify-center md:justify-start mb-6 group animate-float-in" style={{ animationDelay: '0.1s' }}>
           <Users className="h-10 w-10 text-primary mr-4 flex-shrink-0 transition-transform duration-300 group-hover:animate-icon-pulse-subtle" />
            <div>
              <h2 className="text-3xl font-semibold text-primary">Our Leadership</h2>
            </div>
        </div>
        <p className="text-center text-lg text-foreground/80 mb-10 max-w-2xl mx-auto animate-float-in" style={{ animationDelay: '0.2s' }}>
            Meet the dedicated individuals guiding Anointed Star Foundation towards its mission.
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadershipData.map((member, index) => (
            <Card 
              key={member.id} 
              className="text-center shadow-lg hover:shadow-xl transition-shadow group animate-float-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <CardHeader className="items-center">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="rounded-full mb-4 border-4 border-primary/50 object-cover transition-transform duration-300 group-hover:scale-110"
                  data-ai-hint={member.dataAiHint}
                />
                <CardTitle className="text-xl text-primary">{member.name}</CardTitle>
                <CardDescription className="text-accent font-medium">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">{member.bio}</p>
                {member.name === 'Dr. Stella Placid' && (
                  <p className="mt-4 text-xs italic text-muted-foreground/80 tracking-wider font-serif">
                    ~ Dr. Stella Placid
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
