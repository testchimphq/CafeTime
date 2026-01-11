
"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { MOCK_DETAILED_EMPLOYEES } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Routes } from '@/lib/constants';

export default function TeamManagementPage() {
  const { user } = useAuth();
  const router = useRouter();

  // This page is for managers only
  React.useEffect(() => {
    if (user && user.role !== 'manager') {
      router.replace(Routes.DASHBOARD); // Redirect non-managers
    }
  }, [user, router]);

  if (!user || user.role !== 'manager') {
    // Render loading or null while redirecting or if user is not a manager
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading or unauthorized...</p>
      </div>
    );
  }

  // Filter out the manager from the list to display only employees
  const employeesToDisplay = MOCK_DETAILED_EMPLOYEES.filter(emp => emp.role === 'employee');

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Team Members
          </CardTitle>
          <CardDescription>
            View and manage your team members' profiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employeesToDisplay.length === 0 ? (
            <p className="text-muted-foreground">No employees found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Current Wage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeesToDisplay.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={employee.avatarUrl || `https://placehold.co/40x40.png?text=${employee.name.charAt(0)}`} alt={employee.name} aria-label={`Avatar of ${employee.name}`} data-ai-hint="employee avatar" />
                        <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>${employee.currentWage?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`${Routes.TEAM}/profile?id=${employee.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View/Edit Profile
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
