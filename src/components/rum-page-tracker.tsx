"use client";

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { emitEvent } from '@/lib/testchimp';

function PageTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    emitEvent('page_view', { url, pathname });
  }, [pathname, searchParams]);

  return null;
}

export function RUMPageTracker() {
  return (
    <Suspense fallback={null}>
      <PageTrackerContent />
    </Suspense>
  );
}
