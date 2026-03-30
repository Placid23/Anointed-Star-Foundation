
'use client';

import Image from 'next/image';
import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { Target, Eye, Milestone, Users, Loader2, HeartHandshake } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';

export default function AboutPage() {
  const db = useFirestore();
  
  // Fetch dynamic content
  const aboutRef = useMemoFirebase(() => doc(db, 'about', 'content'), [db]);
  const { data: aboutContent, loading: contentLoading } = useDoc(aboutRef);
  
  const leadershipQuery = useMemoFirebase(() => query(collection(db, 'leadership'), orderBy('order', 'asc')), [db]);
  const { data: members, loading: membersLoading } = useCollection(leadershipQuery);

  if (contentLoading || membersLoading) {
    return (
      <SectionWrapper>
        <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
      </SectionWrapper>
    );
  }

  // Fallback defaults if Firestore is empty
  const content = aboutContent || {
    heroSubtitle: "Dedicated to empowering individuals and fostering sustainable community development.",
    heroImageUrl: imageData.about.teamCollaboration.src,
    mission: "To empower underserved communities through comprehensive programs in education, health, and economic development, fostering self-reliance and creating lasting positive change.",
    vision: "We envision a world where every individual has the opportunity to reach their full potential, live with dignity, and contribute meaningfully to society.",
    history: "Founded with a passion for service, Anointed Foundation began as a small initiative. Over the years, we have grown into a multifaceted foundation impacting thousands of lives annually.",
    partnersText: "We are proud to collaborate with organizations and individuals who share our vision for a better world."
  };

  // Grouping leadership
  const primaryLeaders = members?.filter(m => 
    m.role.toLowerCase().includes('founder') || 
    m.role.toLowerCase().includes('ceo') || 
    m.role.toLowerCase().includes('president')
  ) || [];

  const otherLeaders = members?.filter(m => 
    !m.role.toLowerCase().includes('founder') && 
    !m.role.toLowerCase().includes('ceo') && 
    !m.role.toLowerCase().includes('president')
  ) || [];

  return (
    <>
      <SectionWrapper>
        <PageTitle
          title="About Anointed Foundation"
          subtitle={content.heroSubtitle}
        />
      </SectionWrapper>

      <SectionWrapper className="bg-secondary/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-float-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl border-4 border-white">
               <Image
                src={content.heroImageUrl || imageData.about.teamCollaboration.src}
                alt="About Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start group animate-float-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-primary/20 p-3 rounded-xl mr-4 group-hover:bg-primary/30 transition-colors">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Our Mission</h2>
                <p className="text-foreground/90 leading-relaxed">{content.mission}</p>
              </div>
            </div>
            <div className="flex items-start group animate-float-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-primary/20 p-3 rounded-xl mr-4 group-hover:bg-primary/30 transition-colors">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Our Vision</h2>
                <p className="text-foreground/90 leading-relaxed">{content.vision}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="flex items-center group mb-8 animate-float-in">
           <Milestone className="h-10 w-10 text-primary mr-4 transition-transform group-hover:animate-icon-bounce" />
           <h2 className="text-3xl font-bold text-primary">Our History</h2>
        </div>
        <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-4 whitespace-pre-wrap animate-float-in" style={{ animationDelay: '0.2s' }}>
          <p>{content.history}</p>
        </div>
      </SectionWrapper>

      {members && members.length > 0 && (
        <SectionWrapper className="bg-primary/10">
          <div className="text-center mb-12 animate-float-in">
             <Users className="h-12 w-12 text-primary mx-auto mb-4" />
             <h2 className="text-4xl font-bold text-primary mb-4">Our Leadership Team</h2>
             <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                Meet the dedicated professionals and visionaries driving our mission forward.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {primaryLeaders.map((member: any, index: number) => (
              <Card 
                key={member.id} 
                className="text-center shadow-lg hover:shadow-xl transition-all group animate-float-in border-primary/20 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-2 bg-primary" />
                <CardHeader className="items-center pb-2">
                  <div className="relative h-40 w-40 mb-4">
                    <Image
                      src={member.imageUrl || 'https://picsum.photos/seed/leader/300/300'}
                      alt={member.name}
                      fill
                      className="rounded-full border-4 border-primary/10 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardTitle className="text-2xl text-primary">{member.name}</CardTitle>
                  <CardDescription className="text-accent font-bold uppercase tracking-widest text-xs">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "{member.bio}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {otherLeaders.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherLeaders.map((member: any, index: number) => (
                <Card 
                  key={member.id} 
                  className="text-center shadow hover:shadow-md transition-shadow group animate-float-in border-primary/10"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <CardHeader className="items-center p-4">
                    <div className="relative h-20 w-20 mb-2">
                      <Image
                        src={member.imageUrl || 'https://picsum.photos/seed/staff/200/200'}
                        alt={member.name}
                        fill
                        className="rounded-full border-2 border-primary/50 object-cover"
                      />
                    </div>
                    <CardTitle className="text-base text-primary">{member.name}</CardTitle>
                    <CardDescription className="text-accent font-medium text-[10px] uppercase">{member.role}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </SectionWrapper>
      )}

      {content.partnersText && (
        <SectionWrapper>
          <div className="bg-secondary p-8 md:p-12 rounded-3xl text-center border-2 border-dashed border-primary/20 animate-float-in">
            <HeartHandshake className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-primary mb-4">Our Partners</h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              {content.partnersText}
            </p>
          </div>
        </SectionWrapper>
      )}
    </>
  );
}
