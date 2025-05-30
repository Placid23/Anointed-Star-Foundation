
'use client';

import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export default function NewsPage() {
  useEffect(() => {
    notFound();
  }, []);

  return null; // Or a loading spinner, but notFound() should redirect
}
