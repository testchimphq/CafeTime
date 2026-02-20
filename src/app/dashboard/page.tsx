"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShiftCalendar } from "@/components/dashboard/shift-calendar"; // New import
import { CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - in a real app, this would come from a backend or context
import type { Shift, CafeSettings } from "@/types";
import { addHours, addMinutes, set, startOfDay } from "date-fns";

const today = startOfDay(new Date());

const mockShifts: Shift[] = [
  { id: 's1', userId: 'emp1', userName: 'Alice Smith', startTime: set(today, { hours: 9, minutes: 0 }), endTime: set(today, { hours: 14, minutes: 0 }), role: 'Barista' },
  { id: 's2', userId: 'emp2', userName: 'Bob Johnson', startTime: set(today, { hours: 9, minutes: 30 }), endTime: set(today, { hours: 15, minutes: 30 }), role: 'Cashier' },
  { id: 's3', userId: 'emp3', userName: 'Charlie B.', startTime: set(today, { hours: 13, minutes: 0 }), endTime: set(today, { hours: 17, minutes: 0 }), role: 'Barista' },
  { id: 's4', userId: 'emp1', userName: 'Alice Smith', startTime: addHours(set(today, { hours: 10, minutes: 0 }), 24), endTime: addHours(set(today, { hours: 16, minutes: 0 }), 24), role: 'Barista' }, // Tomorrow
];

const mockCafeSettings: CafeSettings = {
  openingTime: "08:00",
  closingTime: "18:00",
  holidayCountry: "US",
  holidayState: "CA",
  specialOverrides: [],
};


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Intentional Performance Bug: Slow Page Load (3 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Intentional Performance Bug: Long Task (Blocking main thread)
    // Calculating something uselessly to block the thread for > 100ms
    const start = performance.now();
    while (performance.now() - start < 200) {
      // Blocking loop
      Math.sqrt(Math.random() * 1000000);
    }
    console.log("Long task completed");

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <CalendarDays className="mr-2 h-6 w-6 text-primary" />
            Shift Calendar
          </CardTitle>
          <CardDescription>
            View upcoming shifts. Default view is weekly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Replace placeholder with the actual ShiftCalendar component */}
          <ShiftCalendar shifts={mockShifts} settings={mockCafeSettings} />
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Today's Shifts</h3>
                <p className="text-2xl font-bold">5</p> {/* This should be dynamic */}
            </Card>
            <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Open Requests</h3>
                <p className="text-2xl font-bold">2</p> {/* This should be dynamic */}
            </Card>
            <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Team Members</h3>
                <p className="text-2xl font-bold">12</p> {/* This should be dynamic */}
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
