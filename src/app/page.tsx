"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import { Routes } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(Routes.DASHBOARD);
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    // Show a loading state or a blank page while redirecting
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 p-8 rounded-lg shadow-lg bg-card">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return <LoginForm />;
}
