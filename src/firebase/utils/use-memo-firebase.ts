'use client';

import { useMemo } from 'react';

/**
 * A simple wrapper around useMemo to clarify its purpose for stabilizing 
 * Firestore queries and references. This prevents infinite render loops
 * in hooks like useCollection and useDoc.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
