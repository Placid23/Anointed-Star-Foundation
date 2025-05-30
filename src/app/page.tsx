
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/shared/PageTitle';
import ProgramCard from '@/components/shared/ProgramCard';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { programsData } from '@/lib/data';
import { Handshake, Users, HeartHandshake, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredPrograms = programsData.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <SectionWrapper className="bg-gradient-to-br from-primary/10 via-background to-background pt-24 pb-16 md:pt-32 md:pb-24 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Welcome to <span className="text-primary">Anointed Star Foundation</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-10">
            Empowering communities, illuminating futures. Join us in making a lasting impact.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
              <Link href="/donate">Donate Now <HeartHandshake className="ml-2 h-5 w-5" /></Link>
            </Button>
            {/* Link to /programs page removed */}
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Learn About Us <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* About Us Snippet */}
      <SectionWrapper>
        <PageTitle title="Who We Are" subtitle="Learn more about our mission to create positive change." />
        <div className="max-w-3xl mx-auto text-center text-foreground/90">
          <p className="mb-4">
            Anointed Star Foundation is a dedicated foundation committed to uplifting individuals and communities through impactful programs in education, health, and sustainable development. We believe in the power of collective effort to foster growth and opportunity for all.
          </p>
          <Button asChild variant="link" className="text-primary hover:text-primary/80">
            <Link href="/about">Discover Our Story <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </SectionWrapper>
      
      {/* Key Programs Section */}
      <SectionWrapper className="bg-secondary/50">
        <PageTitle title="Our Key Programs" subtitle="Making a tangible difference where it's needed most." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPrograms.map((program, index) => (
            <div
              key={program.id}
              className="animate-float-in" 
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <ProgramCard program={program} />
            </div>
          ))}
        </div>
        {/* "View All Programs" button removed as /programs page is removed */}
      </SectionWrapper>

      {/* Call to Action Section */}
      <SectionWrapper>
        <PageTitle title="Get Involved" subtitle="Your support can transform lives. Find out how you can contribute." />
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Donate Card */}
          <div className="group p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-primary border border-transparent hover:scale-105">
            <HeartHandshake className="h-12 w-12 text-accent mx-auto mb-4 transition-transform duration-300 ease-out group-hover:animate-heart-handshake-hover" />
            <h3 className="text-xl font-semibold mb-2 text-primary">Donate</h3>
            <p className="text-foreground/80 mb-4">Your generous contributions fuel our initiatives and bring hope to many.</p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/donate">Support Us</Link>
            </Button>
          </div>
          {/* Volunteer Card */}
          <div className="group p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-primary border border-transparent hover:scale-105">
            <Handshake className="h-12 w-12 text-accent mx-auto mb-4 transition-transform duration-300 ease-out group-hover:animate-handshake-hover" />
            <h3 className="text-xl font-semibold mb-2 text-primary">Volunteer</h3>
            <p className="text-foreground/80 mb-4">Lend your time and skills to make a direct impact in our community programs.</p>
            <Button asChild variant="outline">
              <Link href="/contact#volunteer">Join Our Team</Link>
            </Button>
          </div>
          {/* Partner Card */}
          <div className="group p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-primary border border-transparent hover:scale-105">
            <Users className="h-12 w-12 text-accent mx-auto mb-4 transition-transform duration-300 ease-out group-hover:animate-users-hover" />
            <h3 className="text-xl font-semibold mb-2 text-primary">Partner</h3>
            <p className="text-foreground/80 mb-4">Collaborate with us to amplify our reach and create synergistic impact.</p>
            <Button asChild variant="outline">
              <Link href="/contact#partner">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* Testimonial/Impact Snippet */}
      <SectionWrapper className="bg-primary/10">
         <PageTitle title="Real Impact, Real Stories" subtitle="See how your support is changing lives."/>
         <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-xl italic text-foreground/90 mb-4">
            "Anointed Star Foundation gave me the skills and confidence to start my own business. My life has completely changed for the better!"
          </blockquote>
          <p className="font-semibold">- Maria S., Program Beneficiary</p>
          {/* Link to /impact page removed */}
          <Button asChild variant="link" className="text-primary hover:text-primary/80 mt-6">
            <Link href="/news">Read More Stories <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
         </div>
      </SectionWrapper>
    </>
  );
}
