"use client";

import React, { useState, useEffect } from 'react';
import { MOCK_DETAILED_EMPLOYEES } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function TeamSearchPage() {
  const [query, setQuery] = useState('');
  // Use a separate state for the list to ensure client-side hydration doesn't mismatch initially if we wanted complex logic, 
  // but simple filtering in render is fine for this demo. We'll stick to render-time filtering for instant crash.

  const filteredEmployees = MOCK_DETAILED_EMPLOYEES.filter(emp =>
    emp.name.toLowerCase().includes(query.toLowerCase()) ||
    emp.email.toLowerCase().includes(query.toLowerCase())
  );

  // Intentional crash on 0 state
  if (filteredEmployees.length === 0) {
    throw new Error("Find Member Demo Crash: No members found (Intentionally crashed for 0 results)");
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Team Search Demo</CardTitle>
          <CardDescription>
            Search for team members. Warning: This page is designed to crash if no results are found!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                     <AvatarImage src={employee.avatarUrl || `https://placehold.co/40x40.png?text=${employee.name.charAt(0)}`} alt={employee.name} />
                    <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{employee.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
