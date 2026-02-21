
"use client";

import type { Shift, CafeSettings } from "@/types";
import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, Clock } from "lucide-react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  getHours,
  getMinutes,
  differenceInMinutes,
  addMinutes,
  startOfDay,
  isBefore,
  isAfter
} from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ShiftCalendarProps {
  shifts: Shift[];
  settings: CafeSettings;
}

const TIME_SLOT_MINUTES = 30;

const formatUserName = (name: string | undefined): string => {
  if (!name) return 'N/A';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
  return parts[0];
};

export function ShiftCalendar({ shifts, settings }: ShiftCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDayForDayView, setSelectedDayForDayView] = useState<Date>(new Date());

  const weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1; // Monday

  const currentWeekStart = startOfWeek(currentDate, { weekStartsOn });
  const currentWeekEnd = endOfWeek(currentDate, { weekStartsOn });
  const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

  const openingTime = useMemo(() => {
    const [hours, minutes] = settings.openingTime.split(":").map(Number);
    return setHours(setMinutes(startOfDay(new Date()), minutes), hours);
  }, [settings.openingTime]);

  const closingTime = useMemo(() => {
    const [hours, minutes] = settings.closingTime.split(":").map(Number);
    return setHours(setMinutes(startOfDay(new Date()), minutes), hours);
  }, [settings.closingTime]);

  const timeSlots = useMemo(() => {
    const slots = [];
    let currentTime = openingTime;
    while (isBefore(currentTime, closingTime)) {
      slots.push(currentTime);
      currentTime = addMinutes(currentTime, TIME_SLOT_MINUTES);
    }
    return slots;
  }, [openingTime, closingTime]);

  const handlePrevWeek = () => setCurrentDate(prev => addDays(prev, -7));
  const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));
  const handleToday = () => setCurrentDate(new Date());

  const handleDateSelect = (date?: Date) => {
    if (date) {
      setCurrentDate(date);
      setSelectedDayForDayView(date);
      if (viewMode === 'week') setViewMode('day'); // Optionally switch to day view on date select
    }
  };
  
  const switchToDayView = (day: Date) => {
    setSelectedDayForDayView(day);
    setViewMode("day");
  };

  const renderShiftInSlot = (slotTime: Date, day: Date): JSX.Element[] => {
    const slotStartTime = setHours(setMinutes(setSeconds(setMilliseconds(day,0),0),getMinutes(slotTime)), getHours(slotTime));
    const slotEndTime = addMinutes(slotStartTime, TIME_SLOT_MINUTES);

    return shifts
      .filter(shift => 
        isSameDay(shift.startTime, day) &&
        isWithinInterval(shift.startTime, { start: slotStartTime, end: slotEndTime }) || // Shift starts in this slot
        isWithinInterval(slotStartTime, { start: shift.startTime, end: shift.endTime }) && !isSameDay(slotStartTime, shift.endTime) // Slot is within shift duration
      )
      .map(shift => (
        <Popover key={shift.id}>
          <PopoverTrigger asChild>
            <div
              className="bg-primary/20 text-primary-foreground p-1 rounded-sm text-xs truncate cursor-pointer hover:bg-primary/40"
              title={`${formatUserName(shift.userName)}: ${format(shift.startTime, "HH:mm")} - ${format(shift.endTime, "HH:mm")}`}
            >
              {formatUserName(shift.userName)}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <p className="font-semibold">{formatUserName(shift.userName)} ({shift.role})</p>
            <p className="text-sm">{format(shift.startTime, "EEE, MMM d, HH:mm")} - {format(shift.endTime, "HH:mm")}</p>
            {shift.notes && <p className="text-xs mt-1 text-muted-foreground">Notes: {shift.notes}</p>}
          </PopoverContent>
        </Popover>
      ));
  };

  const renderWeeklyView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-border">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border border-border w-24 sticky left-0 bg-muted z-10">Time</th>
            {daysInWeek.map(day => (
              <th key={day.toISOString()} className="p-2 border border-border cursor-pointer hover:bg-muted-foreground/20" onClick={() => switchToDayView(day)}>
                {format(day, "EEE d")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(slotTime => (
            <tr key={format(slotTime, "HH:mm")}>
              <td className="p-2 border border-border text-xs text-muted-foreground sticky left-0 bg-background z-10">{format(slotTime, "HH:mm")}</td>
              {daysInWeek.map(day => (
                <td key={day.toISOString()} className="p-1 border border-border h-10 align-top text-left relative">
                  <div className="space-y-0.5">
                    {renderShiftInSlot(slotTime, day)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDailyView = () => {
    const dayShifts = shifts.filter(shift => isSameDay(shift.startTime, selectedDayForDayView));
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">{format(selectedDayForDayView, "EEEE, MMMM d, yyyy")}</h3>
         <div className="border border-border rounded-md">
            <div className="bg-muted p-2 font-semibold border-b border-border">Time</div>
            {timeSlots.map(slotTime => (
              <div key={format(slotTime, "HH:mm")} className="flex border-b border-border last:border-b-0">
                <div className="p-2 w-24 border-r border-border text-xs text-muted-foreground">{format(slotTime, "HH:mm")}</div>
                <div className="p-1 flex-1 h-10 align-top relative space-y-0.5">
                  {renderShiftInSlot(slotTime, selectedDayForDayView)}
                </div>
              </div>
            ))}
         </div>
      </div>
    );
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={viewMode === 'week' ? handlePrevWeek : () => setSelectedDayForDayView(addDays(selectedDayForDayView, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                {viewMode === 'week' ? `${format(currentWeekStart, "MMM d")} - ${format(currentWeekEnd, "MMM d, yyyy")}` : format(selectedDayForDayView, "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={viewMode === 'week' ? handleNextWeek : () => setSelectedDayForDayView(addDays(selectedDayForDayView, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleToday}>Today</Button>
        </div>
        <div className="flex items-center gap-2">
            <Button variant={viewMode === 'week' ? 'default' : 'outline'} onClick={() => setViewMode('week')}>Week</Button>
            <Button variant={viewMode === 'day' ? 'default' : 'outline'} onClick={() => setViewMode('day')}>Day</Button>
        </div>
      </div>

      {viewMode === 'week' ? renderWeeklyView() : renderDailyView()}
      
      <div className="mt-4 p-4 border border-dashed border-border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>Managers: Determine how many people need to be assigned to each time slot in "Manage Shifts".</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="h-5 w-5" />
            <span>Cafe Hours: {settings.openingTime} - {settings.closingTime}. Configure in Settings.</span>
          </div>
      </div>
    </div>
  );
}
