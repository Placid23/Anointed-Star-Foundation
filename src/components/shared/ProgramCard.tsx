'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Program } from '@/lib/types';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  if (!program) return null;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full glass border-white/5 hover:border-accent/30 transition-all duration-500 group overflow-hidden rounded-[2rem]">
        <CardHeader className="p-0 overflow-hidden relative">
          <Image
            src={program.imageUrl || 'https://picsum.photos/seed/placeholder/600/400'}
            alt={program.title}
            width={600}
            height={400}
            className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent opacity-60" />
          <div className="absolute top-4 left-4">
             <div className="glass px-3 py-1 rounded-full border-white/20 flex items-center gap-1.5">
                <Star className="h-3 w-3 text-accent fill-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Impact</span>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 flex-grow">
          <CardTitle className="text-2xl font-bold mb-3 text-white group-hover:text-accent transition-colors">
            {program.title}
          </CardTitle>
          <CardDescription className="text-white/60 text-sm leading-relaxed line-clamp-3">
            {program.shortDescription}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-8 pt-0">
          <Button asChild variant="outline" className="w-full glass border-white/10 text-white rounded-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-transparent font-bold transition-all">
            <Link href={`/programs/${program.slug}`} className="flex items-center justify-between px-6">
              View Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}