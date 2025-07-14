
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck2, Clock, PlusCircle, Save, Trash2, Repeat } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { RecurringAvailabilityPreference } from "@/types";
import { useAuth } from "@/contexts/auth-context";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

const availabilityFormSchema = z.object({
  requestType: z.enum(["unavailability", "vacation"], { required_error: "Please select a request type." }),
  date: z.date().optional(),
  startTime: z.string().optional(), 
  endTime: z.string().optional(),
  isAllDay: z.boolean().default(false),
  vacationStartDate: z.date().optional(),
  vacationEndDate: z.date().optional(),
  reason: z.string().max(200, "Reason must be 200 characters or less.").optional(),
}).refine(data => {
  if (data.requestType === "unavailability" && !data.date) return false;
  if (data.requestType === "unavailability" && !data.isAllDay && (!data.startTime || !data.endTime)) return false;
  if (data.requestType === "unavailability" && !data.isAllDay && data.startTime && data.endTime && data.endTime <= data.startTime) return false;
  if (data.requestType === "vacation" && (!data.vacationStartDate || !data.vacationEndDate)) return false;
  if (data.requestType === "vacation" && data.vacationStartDate && data.vacationEndDate && data.vacationEndDate < data.vacationStartDate) return false;
  return true;
}, {
  message: "Please fill in all required fields for the selected request type and ensure dates/times are valid.",
  path: ['requestType'] 
});

type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>;

const recurringPreferenceSchema = z.object({
  dayOfWeek: z.string({ required_error: "Please select a day." }),
  startTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)."),
  endTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)."),
  notes: z.string().max(100, "Notes too long").optional(),
}).refine(data => data.endTime > data.startTime, {
  message: "End time must be after start time.",
  path: ["endTime"],
});
type RecurringPreferenceFormValues = z.infer<typeof recurringPreferenceSchema>;

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MyAvailabilityPage() {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [recurringPreferences, setRecurringPreferences] = useState<RecurringAvailabilityPreference[]>(user?.recurringPreferences || []);

  const availabilityForm = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      requestType: "unavailability",
      isAllDay: false,
    },
  });

  const recurringForm = useForm<RecurringPreferenceFormValues>({
    resolver: zodResolver(recurringPreferenceSchema),
    defaultValues: {
      dayOfWeek: undefined,
      startTime: "",
      endTime: "",
      notes: "",
    }
  });

  const requestType = availabilityForm.watch("requestType");

  async function onAvailabilitySubmit(data: AvailabilityFormValues) {
    console.log("Submitting availability/vacation request:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Request Submitted",
      description: `Your ${data.requestType} request has been successfully submitted.`,
    });
    availabilityForm.reset();
  }

  function onRecurringSubmit(data: RecurringPreferenceFormValues) {
    const newPreference: RecurringAvailabilityPreference = {
      id: Date.now().toString(),
      ...data,
    };
    const updatedPreferences = [...recurringPreferences, newPreference];
    setRecurringPreferences(updatedPreferences);
    if(user) updateUser({ ...user, recurringPreferences: updatedPreferences}); // Update context/localStorage
    toast({ title: "Preference Added", description: `Preferred hours for ${data.dayOfWeek} saved.` });
    recurringForm.reset();
  }

  function removeRecurringPreference(id: string) {
    const updatedPreferences = recurringPreferences.filter(pref => pref.id !== id);
    setRecurringPreferences(updatedPreferences);
     if(user) updateUser({ ...user, recurringPreferences: updatedPreferences});
    toast({ title: "Preference Removed", variant: "destructive" });
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <CalendarCheck2 className="mr-2 h-6 w-6 text-primary" />
            Submit Time Off / Unavailability
          </CardTitle>
          <CardDescription>
            Mark specific dates/times you cannot work or request vacation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...availabilityForm}>
            <form onSubmit={availabilityForm.handleSubmit(onAvailabilitySubmit)} className="space-y-8">
              <FormField
                control={availabilityForm.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Request Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="unavailability" />
                          </FormControl>
                          <FormLabel className="font-normal">Mark Unavailability (Specific Date/Time)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="vacation" />
                          </FormControl>
                          <FormLabel className="font-normal">Request Vacation (Date Range)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {requestType === "unavailability" && (
                <>
                  <FormField
                    control={availabilityForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                           <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                            className="rounded-md border w-auto inline-block"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={availabilityForm.control}
                    name="isAllDay"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>All Day</FormLabel>
                          <FormDescription>
                            Mark yourself unavailable for the entire selected day.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  {!availabilityForm.watch("isAllDay") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={availabilityForm.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={availabilityForm.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </>
              )}

              {requestType === "vacation" && (
                <>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={availabilityForm.control}
                      name="vacationStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Vacation Start Date</FormLabel>
                           <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                            className="rounded-md border w-auto inline-block"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={availabilityForm.control}
                      name="vacationEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Vacation End Date</FormLabel>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < (availabilityForm.getValues("vacationStartDate") || new Date(new Date().setHours(0,0,0,0)))}
                            initialFocus
                            className="rounded-md border w-auto inline-block"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <FormField
                control={availabilityForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly explain your request if needed."
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={availabilityForm.formState.isSubmitting}>
                {availabilityForm.formState.isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Repeat className="mr-2 h-6 w-6 text-primary" />
            Set Recurring Preferred Hours
          </CardTitle>
          <CardDescription>
            Define your general availability for work on a weekly basis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...recurringForm}>
            <form onSubmit={recurringForm.handleSubmit(onRecurringSubmit)} className="space-y-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <FormField
                  control={recurringForm.control}
                  name="dayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of Week</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {daysOfWeek.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={recurringForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={recurringForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={recurringForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Morning classes, childcare pickup" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={recurringForm.formState.isSubmitting}>
                <PlusCircle className="mr-2 h-4 w-4" /> {recurringForm.formState.isSubmitting ? "Adding..." : "Add Preference"}
              </Button>
            </form>
          </Form>

          {recurringPreferences.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2 mt-6">Your Saved Preferences</h3>
              <ul className="space-y-3">
                {recurringPreferences.map(pref => (
                  <li key={pref.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30">
                    <div>
                      <p className="font-semibold">{pref.dayOfWeek}: {pref.startTime} - {pref.endTime}</p>
                      {pref.notes && <p className="text-sm text-muted-foreground">Notes: {pref.notes}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeRecurringPreference(pref.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recurringPreferences.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No recurring preferences set yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
