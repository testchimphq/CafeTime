
"use client";

import { Button } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"; // Renamed to avoid conflict
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardEdit, PlusCircle, Send, Lock, UserCheck, CalendarPlus, GripVertical, UsersRound } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Shift, CafeSettings } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, format, setHours, setMinutes, getHours, getMinutes, startOfDay, isBefore, addMinutes as dateAddMinutes, isSameDay, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { mockSimpleEmployees } from '@/lib/mock-data';

const mockCafeSettings: CafeSettings = {
  openingTime: "08:00",
  closingTime: "18:00",
  specialOverrides: [],
};

const TIME_SLOT_MINUTES = 30;

const shiftDialogFormSchema = z.object({
  employeeId: z.string(),
  employeeName: z.string(),
  date: z.date(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  role: z.string().min(1, "Role is required.").max(50, "Role must be 50 characters or less."),
  notes: z.string().max(200, "Notes must be 200 characters or less.").optional(),
}).refine(data => {
  if (data.startTime && data.endTime) {
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      return false;
    }
  }
  return true;
}, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

type ShiftDialogFormValues = z.infer<typeof shiftDialogFormSchema>;

export default function ManageShiftsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string; name: string } | null>(null);
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [shiftDialogInitialData, setShiftDialogInitialData] = useState<Partial<ShiftDialogFormValues>>({});
  
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const [isDragging, setIsDragging] = useState(false);
  const [dragAnchorCell, setDragAnchorCell] = useState<{ day: Date; timeSlot: Date } | null>(null);
  const [dragCurrentCell, setDragCurrentCell] = useState<{ day: Date; timeSlot: Date } | null>(null);

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
    }
    return () => {
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging]);

  const dialogForm = useForm<ShiftDialogFormValues>({
    resolver: zodResolver(shiftDialogFormSchema),
    defaultValues: {
        employeeId: "",
        employeeName: "",
        startTime: "",
        endTime: "",
        role: "Barista",
        notes: "",
    },
  });

  const openingTimeDate = useMemo(() => {
    const [hours, minutes] = mockCafeSettings.openingTime.split(":").map(Number);
    return setHours(setMinutes(startOfDay(new Date()), minutes), hours);
  }, [mockCafeSettings.openingTime]);

  const closingTimeDate = useMemo(() => {
    const [hours, minutes] = mockCafeSettings.closingTime.split(":").map(Number);
    return setHours(setMinutes(startOfDay(new Date()), minutes), hours);
  }, [mockCafeSettings.closingTime]);

  const timeSlots = useMemo(() => {
    const slots = [];
    let currentTime = openingTimeDate;
    while (isBefore(currentTime, closingTimeDate)) {
      slots.push(currentTime);
      currentTime = dateAddMinutes(currentTime, TIME_SLOT_MINUTES);
    }
    return slots;
  }, [openingTimeDate, closingTimeDate]);

  const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }) });

  const handleEmployeeSelect = (employee: { id: string; name: string }) => {
    setSelectedEmployee(employee);
    toast({ title: "Employee Selected", description: `${employee.name} selected. Now click and drag on a time slot to define a shift.`});
  };

  const handleSlotMouseDown = (day: Date, slotStartTime: Date) => {
    if (!selectedEmployee) {
      toast({
        title: "No Employee Selected",
        description: "Please select an employee from the list first.",
        variant: "destructive",
      });
      return;
    }
    setIsDragging(true);
    setDragAnchorCell({ day, timeSlot: slotStartTime });
    setDragCurrentCell({ day, timeSlot: slotStartTime });
  };

  const handleSlotMouseEnter = (day: Date, slotStartTime: Date) => {
    if (!isDragging || !dragAnchorCell) return;

    if (isSameDay(day, dragAnchorCell.day)) {
      if (!isBefore(slotStartTime, dragAnchorCell.timeSlot)) {
        setDragCurrentCell({ day, timeSlot: slotStartTime });
      } else {
        // If dragging upwards on the same day, snap current to anchor.
        setDragCurrentCell(dragAnchorCell);
      }
    }
    // If dragging to another day, current behavior is to not update dragCurrentCell,
    // effectively limiting drag to the anchor day.
  };
  
  const handleTableMouseUp = () => {
    if (!isDragging || !selectedEmployee || !dragAnchorCell) {
      if (isDragging) setIsDragging(false); // Reset if drag somehow started without anchor
      return;
    }

    const { day: anchorDay, timeSlot: anchorTimeSlot } = dragAnchorCell;
    // Use dragCurrentCell if available and valid, otherwise fallback to anchor cell
    const currentSelectionEndSlot = (dragCurrentCell && isSameDay(dragCurrentCell.day, anchorDay) && !isBefore(dragCurrentCell.timeSlot, anchorTimeSlot)) 
                                   ? dragCurrentCell.timeSlot 
                                   : anchorTimeSlot;

    const shiftStartTime = anchorTimeSlot;
    
    const isPureClick = dragCurrentCell && anchorTimeSlot.getTime() === currentSelectionEndSlot.getTime();
    
    let shiftEndTimeCalc = isPureClick 
      ? dateAddMinutes(anchorTimeSlot, 60) // Default 1 hour for a click
      : dateAddMinutes(currentSelectionEndSlot, TIME_SLOT_MINUTES); // End of dragged slot

    // Cap shiftEndTime at cafe's closing time for that day
    const dayClosingTime = setHours(setMinutes(startOfDay(anchorDay), getMinutes(closingTimeDate)), getHours(closingTimeDate));
    if (isAfter(shiftEndTimeCalc, dayClosingTime)) {
      shiftEndTimeCalc = dayClosingTime;
    }
    // Also ensure shiftEndTime is not before or equal to shiftStartTime after capping
     if (!isAfter(shiftEndTimeCalc, shiftStartTime)) {
        shiftEndTimeCalc = dateAddMinutes(shiftStartTime, TIME_SLOT_MINUTES); // Minimum one slot
        if (isAfter(shiftEndTimeCalc, dayClosingTime)) { // Re-cap if min slot goes over
            shiftEndTimeCalc = dayClosingTime;
        }
    }


    const formattedStartTime = format(shiftStartTime, "HH:mm");
    const formattedEndTime = format(shiftEndTimeCalc, "HH:mm");

    const initialData = {
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      date: anchorDay,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      role: "Barista",
      notes: "",
    };

    setShiftDialogInitialData(initialData);
    dialogForm.reset(initialData); // Reset form with new values
    setIsShiftDialogOpen(true);

    setIsDragging(false);
    setDragAnchorCell(null);
    setDragCurrentCell(null);
  };


  async function onDialogFormSubmit(data: ShiftDialogFormValues) {
    // Ensure date from form is correctly merged with time
    const startDate = startOfDay(data.date); // Use the date from the form
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);

    const newShift: Shift = {
      id: Date.now().toString(),
      userId: data.employeeId,
      userName: mockSimpleEmployees.find(emp => emp.id === data.employeeId)?.name,
      startTime: setHours(setMinutes(startDate, startMinute), startHour),
      endTime: setHours(setMinutes(startDate, endMinute), endHour),
      role: data.role,
      notes: data.notes,
      isFinalized: false,
    };
    setShifts(prevShifts => [...prevShifts, newShift]);

    toast({
      title: "Shift Created",
      description: `Shift for ${newShift.userName} on ${format(newShift.startTime, "PPP")} has been created.`,
    });
    setIsShiftDialogOpen(false);
    setSelectedEmployee(null);
    dialogForm.reset({ // Reset to truly empty/default state after submission
        employeeId: "",
        employeeName: "",
        // date will be set by new interaction, no need to reset it here
        startTime: "",
        endTime: "",
        role: "Barista",
        notes: "",
    });
  }
  
  const handleFinalizeRoster = () => {
    console.log("Finalizing current week's roster and notifying team...");
    toast({
      title: "Roster Finalized (Simulated)",
      description: "Current week's roster has been locked. SMS notifications would be sent to the team.",
      duration: 5000,
    });
  };

  const goToPreviousWeek = () => setCurrentWeekStart(prev => addDays(prev, -7));
  const goToNextWeek = () => setCurrentWeekStart(prev => addDays(prev, 7));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <CalendarPlus className="mr-2 h-6 w-6 text-primary" />
                Create &amp; Manage Shifts
              </CardTitle>
              <CardDescription>
                Select an employee, then click and drag on a time slot in the calendar to assign a shift.
              </CardDescription>
            </div>
            {user?.role === 'manager' && (
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <Lock className="mr-2 h-4 w-4" /> Finalize Week &amp; Notify
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Finalize Roster?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will lock shifts for the current week and (simulate) sending SMS notifications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleFinalizeRoster} className="bg-primary hover:bg-primary/90">
                      <Send className="mr-2 h-4 w-4" /> Yes, Finalize &amp; Notify
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <UsersRound className="mr-2 h-5 w-5 text-muted-foreground"/>
              Available Employees
            </h3>
            <div className="space-y-2">
              {mockSimpleEmployees.map(emp => (
                <Button
                  key={emp.id}
                  variant={selectedEmployee?.id === emp.id ? "default" : "outline"}
                  className={cn("w-full justify-start text-left", selectedEmployee?.id === emp.id && "ring-2 ring-primary ring-offset-2")}
                  onClick={() => handleEmployeeSelect(emp)}
                >
                  <GripVertical className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                  {emp.name}
                </Button>
              ))}
            </div>
            {selectedEmployee && (
              <p className="text-sm text-primary p-2 bg-primary/10 rounded-md">
                Selected: <span className="font-semibold">{selectedEmployee.name}</span>. Click & drag on calendar.
              </p>
            )}
          </div>

          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={goToPreviousWeek}>Prev Week</Button>
                    <Button variant="outline" onClick={goToToday}>Today</Button>
                    <Button variant="outline" onClick={goToNextWeek}>Next Week</Button>
                </div>
                <h3 className="text-lg font-semibold">
                    {format(currentWeekStart, "MMM d")} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), "MMM d, yyyy")}
                </h3>
            </div>
            <div 
              className="overflow-x-auto border rounded-lg"
              onMouseUp={handleTableMouseUp} // Catch mouseup anywhere on the table grid area
              onMouseLeave={() => { // If mouse leaves table while dragging, consider it a mouseup
                if (isDragging) handleTableMouseUp();
              }}
            >
              <table className="min-w-full border-collapse">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 border-r sticky left-0 bg-muted z-10 w-24 text-sm">Time</th>
                    {daysInWeek.map(day => (
                      <th key={day.toISOString()} className="p-2 border-r text-sm font-medium">
                        {format(day, "EEE d")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(slotTime => (
                    <tr key={format(slotTime, "HH:mm")}>
                      <td className="p-2 border-r text-xs text-muted-foreground sticky left-0 bg-background z-10 align-top h-12">
                        {format(slotTime, "HH:mm")}
                      </td>
                      {daysInWeek.map(day => {
                        const slotFullDateTime = setHours(setMinutes(day, getMinutes(slotTime)), getHours(slotTime));
                        let isHighlighted = false;
                        if (isDragging && dragAnchorCell && dragCurrentCell && selectedEmployee) {
                          const anchorDay = dragAnchorCell.day;
                          if (isSameDay(day, anchorDay)) {
                            const selectionStartTime = dragAnchorCell.timeSlot;
                            const selectionEndTime = dragCurrentCell.timeSlot; // this is the START of the last slot
                            
                            if (slotFullDateTime.getTime() >= selectionStartTime.getTime() && 
                                slotFullDateTime.getTime() <= selectionEndTime.getTime()) {
                              isHighlighted = true;
                            }
                          }
                        }
                        return (
                          <td 
                            key={day.toISOString() + format(slotTime, "HH:mm")} 
                            className={cn(
                              "p-0.5 border-r h-12 align-top cursor-pointer",
                              isHighlighted ? "bg-primary/30" : "hover:bg-primary/10"
                            )}
                            onMouseDown={() => handleSlotMouseDown(day, slotFullDateTime)}
                            onMouseEnter={() => handleSlotMouseEnter(day, slotFullDateTime)}
                            // onMouseUp is handled by the table wrapper
                          >
                            {/* Existing shifts can be rendered here later */}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isShiftDialogOpen} onOpenChange={(open) => {
          setIsShiftDialogOpen(open);
          if (!open) { // If dialog is closed, reset any lingering drag state
            setIsDragging(false);
            setDragAnchorCell(null);
            setDragCurrentCell(null);
            // Don't deselect employee here, they might want to make another shift
          }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Shift</DialogTitle>
            <DialogDescription>
              Assigning shift for <span className="font-semibold">{shiftDialogInitialData.employeeName}</span> on <span className="font-semibold">{shiftDialogInitialData.date ? format(shiftDialogInitialData.date, "PPP") : ""}</span>.
            </DialogDescription>
          </DialogHeader>
          <Form {...dialogForm}>
            <form onSubmit={dialogForm.handleSubmit(onDialogFormSubmit)} className="space-y-4 pt-4">
              <FormField
                  control={dialogForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={dialogForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={dialogForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Barista, Cashier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={dialogForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific instructions..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={dialogForm.formState.isSubmitting}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  {dialogForm.formState.isSubmitting ? "Creating..." : "Create Shift"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Created Shifts</CardTitle>
          <CardDescription>List of recently created shifts. {user?.role === 'manager' && "(Finalized shifts would be locked from editing.)"}</CardDescription>
        </CardHeader>
        <CardContent>
          {shifts.length === 0 ? (
            <p className="text-muted-foreground">No shifts created yet. Select an employee, click and drag on a time slot above to assign a shift.</p>
          ) : (
            <ul className="space-y-4">
              {shifts.map(shift => (
                <li key={shift.id} className={`p-4 border rounded-lg ${shift.isFinalized ? 'bg-muted/50 opacity-75' : 'bg-muted/20'}`}>
                  <p className="font-semibold">{shift.userName} - {shift.role} {shift.isFinalized && <Lock className="inline h-4 w-4 ml-2 text-muted-foreground" />} </p>
                  <p className="text-sm text-muted-foreground">
                    {format(shift.startTime, "PPP, HH:mm")} - {format(shift.endTime, "HH:mm")}
                  </p>
                  {shift.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {shift.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

