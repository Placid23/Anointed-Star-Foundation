
'use client';

import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export default function MediaPage() {
  useEffect(() => {
    notFound();
  }, []);

  return null;
}
