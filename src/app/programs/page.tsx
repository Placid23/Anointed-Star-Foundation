
'use client';

import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export default function ProgramsPage() {
  useEffect(() => {
    notFound();
  }, []);

  return null; // Or a loading spinner, but notFound() should redirect
}
