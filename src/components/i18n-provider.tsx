'use client';

import { useEffect, useState } from 'react';
import '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && i18n.language) {
      document.documentElement.dir = i18n.dir(i18n.language);
      document.documentElement.lang = i18n.language;
    }
  }, [i18n, i18n.language, isClient]);

  if (!isClient) {
     // Optional: Render a loader or return null to avoid hydration mismatch
     // For now, we render children to ensure SS content is visible, 
     // but be aware of potential text flash if they differ.
     // However, since we are doing client-side only translation mostly, 
     // we might want to wait. 
     // Let's just return children and let client takeover.
     return <>{children}</>;
  }

  return <>{children}</>;
}
