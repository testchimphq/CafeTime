
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // New import
import { useAuth } from '@/contexts/auth-context';
import { Routes, APP_NAME } from '@/lib/constants';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { MainSidebarContent } from '@/components/layout/main-sidebar-content';
import { UserNav } from '@/components/layout/user-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { MessagingProvider, useMessaging } from '@/contexts/messaging-context'; // New import
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // New import

// Inner layout component to access MessagingContext
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const { getUnreadMessageCount } = useMessaging(); // Use messaging context

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(Routes.LOGIN);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }
  
  const unreadMessages = getUnreadMessageCount();

  return (
    <SidebarProvider defaultOpen >
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
        <SidebarContent>
          <MainSidebarContent />
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
          <Button variant="ghost" onClick={logout} className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut />
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center">
             <SidebarTrigger className="md:hidden" />
             <h1 className="text-xl font-semibold text-foreground ml-2 md:ml-0">{APP_NAME}</h1>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 flex flex-col p-0 sm:p-0 overflow-auto"> {/* Changed padding to 0 */}
          {unreadMessages > 0 && (
            <Alert variant="default" className="m-4 sm:m-6 border-primary rounded-lg shadow-md">
              <MessageSquare className="h-5 w-5 text-primary" />
              <AlertTitle className="font-semibold text-primary">You have {unreadMessages} unread message{unreadMessages > 1 ? 's' : ''}!</AlertTitle>
              <AlertDescription>
                Check your inbox to stay updated.
                <Button variant="link" asChild className="p-0 h-auto ml-2 text-primary hover:underline">
                  <Link href={Routes.MESSAGES}>Go to Messages</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <div className="flex-1 p-4 sm:p-6"> {/* Added wrapper div for original padding */}
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


// Main layout component that includes the MessagingProvider
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MessagingProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </MessagingProvider>
  );
}
