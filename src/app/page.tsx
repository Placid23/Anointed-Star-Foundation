
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/shared/PageTitle';
import ProgramCard from '@/components/shared/ProgramCard';
import SectionWrapper from '@/components/shared/SectionWrapper';
import FeedbackForm from '@/components/shared/FeedbackForm';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { Handshake, HeartHandshake, ArrowRight, Loader2, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HomePage() {
  const db = useFirestore();

  const programsQuery = useMemoFirebase(() => {
    return query(collection(db, 'programs'), limit(3));
  }, [db]);

  const { data: featuredPrograms, loading: programsLoading } = useCollection(programsQuery);

  return (
    <>
      {/* Premium Hero Section */}
      <SectionWrapper className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        </div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
              <Image
                src="/anointed-star-hub-logo.jpg.jpeg"
                alt="Logo"
                width={180}
                height={60}
                className="relative z-10 glow-pulse"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10 text-accent text-xs font-bold mb-8 uppercase tracking-[0.2em]"
            >
              <Star className="h-3 w-3 fill-current" />
              <span>Unlocking Human Potential</span>
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
              <span className="text-white">Anointed</span> <br />
              <span className="text-gradient-gold">Foundation</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Empowering, Illuminating, and promoting Happiness through sustainable community development.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="h-14 px-10 gradient-gold text-accent-foreground font-bold shadow-[0_0_30px_rgba(245,166,35,0.3)] hover:scale-105 transition-transform rounded-full">
                <Link href="/donate">Donate Now <HeartHandshake className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-10 glass border-white/20 text-white hover:bg-white/10 rounded-full">
                <Link href="/about">Learn Our Story <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Glassmorphism Mission Section */}
      <SectionWrapper className="bg-secondary/30 relative">
        <div className="max-w-4xl mx-auto glass p-12 rounded-[2rem] border-white/5">
          <div className="flex flex-col items-center text-center">
             <div className="p-4 rounded-2xl bg-accent/10 mb-6">
                <Sparkles className="h-10 w-10 text-accent" />
             </div>
             <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
             <p className="text-lg text-white/70 leading-relaxed mb-8">
              Anointed Foundation is dedicated to uplifting individuals and communities through impactful programs in education, health, and sustainable development. We believe in the power of collective effort to foster growth and opportunity for all.
             </p>
             <Button asChild variant="link" className="text-accent hover:text-accent/80 p-0 text-lg">
                <Link href="/about" className="flex items-center">
                  Explore our history <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
             </Button>
          </div>
        </div>
      </SectionWrapper>
      
      {/* Featured Programs */}
      <SectionWrapper>
        <PageTitle title="Impact Initiatives" subtitle="Targeted programs designed for long-term growth." />
        {programsLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent h-12 w-12" /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {featuredPrograms?.map((program: any, index: number) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* Engagement Stagger Section */}
      <SectionWrapper className="bg-[#0A0F1C] border-y border-white/5">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ y: -10 }}
            className="group glass p-10 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <HeartHandshake className="h-48 w-48 text-accent" />
            </div>
            <HeartHandshake className="h-14 w-14 text-accent mb-8" />
            <h3 className="text-3xl font-bold mb-4 text-white">Give Support</h3>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">Your generous contributions fuel our initiatives and bring hope to many.</p>
            <Button asChild className="h-12 px-8 gradient-gold text-accent-foreground font-black">
              <Link href="/donate">Donate Now</Link>
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="group glass p-10 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <Handshake className="h-48 w-48 text-primary" />
            </div>
            <Handshake className="h-14 w-14 text-primary mb-8" />
            <h3 className="text-3xl font-bold mb-4 text-white">Join Forces</h3>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">Lend your time and skills to make a direct impact in our community programs.</p>
            <Button asChild variant="outline" className="h-12 px-8 glass border-white/20 text-white">
              <Link href="/contact">Volunteer</Link>
            </Button>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Premium Feedback Section */}
      <SectionWrapper className="bg-primary/5">
         <div className="max-w-3xl mx-auto text-center">
           <PageTitle 
              title="Community Voice" 
              subtitle="Your feedback is the spark for our constant evolution."
           />
           <div className="glass p-8 rounded-3xl border-white/10">
              <FeedbackForm />
           </div>
         </div>
      </SectionWrapper>
    </>
  );
}
