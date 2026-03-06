import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { APP_NAME } from '@/lib/constants';
import { ThemeProvider } from "@/components/theme-provider";

import { I18nProvider } from "@/components/i18n-provider";
import { RUMPageTracker } from "@/components/rum-page-tracker";

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Cafe Staff Shift Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <RUMPageTracker />
          <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
