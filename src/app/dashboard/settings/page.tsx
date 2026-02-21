
"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth-context";
import { Settings as SettingsIcon, Clock, MapPin, CalendarOff, PlusCircle, Trash2, Phone } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { CafeSettings, SpecialOperatingHours } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format as formatDate } from "date-fns";


const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format


const specialOperatingHoursSchema = z.object({
  id: z.string().optional(), // For existing items
  date: z.date({ required_error: "Date is required." }),
  openingTime: z.string().regex(timeRegex, "Invalid opening time (HH:MM).").optional().or(z.literal("")),
  closingTime: z.string().regex(timeRegex, "Invalid closing time (HH:MM).").optional().or(z.literal("")),
  isClosed: z.boolean().default(false),
  reason: z.string().max(100, "Reason too long").optional(),
}).refine(data => {
  if (!data.isClosed && (!data.openingTime || !data.closingTime)) {
    return false; // If not closed, times are required
  }
  if (data.openingTime && data.closingTime && data.openingTime >= data.closingTime) {
    return false; // End time must be after start time
  }
  return true;
}, {
  message: "If open, opening and closing times are required, and end time must be after start. Mark as closed if not applicable.",
  path: ["openingTime"], // Attach to a common field
});


const cafeSettingsFormSchema = z.object({
  openingTime: z.string().regex(timeRegex, "Invalid opening time (HH:MM)."),
  closingTime: z.string().regex(timeRegex, "Invalid closing time (HH:MM)."),
  holidayCountry: z.string().optional(),
  holidayState: z.string().optional(),
  specialOverrides: z.array(specialOperatingHoursSchema).optional(),
}).refine(data => data.openingTime < data.closingTime, {
  message: "Closing time must be after opening time.",
  path: ["closingTime"],
});

type CafeSettingsFormValues = z.infer<typeof cafeSettingsFormSchema>;

const profileFormSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  phoneNumber: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;


// Mock initial settings - in a real app, this would be fetched
const initialCafeSettings: CafeSettings = {
  openingTime: "09:00",
  closingTime: "17:00",
  holidayCountry: "US",
  holidayState: "CA",
  specialOverrides: [
    { id: "override1", date: new Date(2024, 11, 25), isClosed: true, reason: "Christmas Day" }
  ],
};


export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Intentional Performance Bug: Long Task (Blocking main thread)
    const start = performance.now();
    while (performance.now() - start < 400) {
      Math.sqrt(Math.random() * 1000000);
    }
  }, []);

  const cafeSettingsForm = useForm<CafeSettingsFormValues>({
    resolver: zodResolver(cafeSettingsFormSchema),
    defaultValues: initialCafeSettings, 
  });

  const { fields, append, remove } = useFieldArray({
    control: cafeSettingsForm.control,
    name: "specialOverrides",
  });
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
    },
    values: { // Ensure form updates if user context changes (e.g., after initial load)
        name: user?.name || "",
        phoneNumber: user?.phoneNumber || "",
    }
  });


  if (!user) return null;

  const onCafeSettingsSubmit = (data: CafeSettingsFormValues) => {
    console.log("Cafe Settings Submitted:", data);
    // TODO: Save these settings to backend/localStorage
    toast({
      title: "Cafe Settings Updated",
      description: "Operating hours and holiday settings have been saved.",
    });
  };

  const onProfileUpdateSubmit = (data: ProfileFormValues) => {
     console.log("Profile Update Submitted:", data);
     updateUser({ name: data.name, phoneNumber: data.phoneNumber });
      toast({
        title: "Profile Updated",
        description: "Your name and phone number have been updated.",
      });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <SettingsIcon className="mr-2 h-6 w-6 text-primary" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account and application preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileUpdateSubmit)} className="space-y-4">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email} readOnly className="cursor-not-allowed bg-muted/50" />
              </div>
               <FormField
                control={profileForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phoneNumber" className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" /> Mobile Phone Number (for SMS notifications)
                    </FormLabel>
                    <FormControl>
                      <Input id="phoneNumber" placeholder="+12345678900" {...field} />
                    </FormControl>
                    <FormDescription>Include country code. E.g., +1 for USA.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                {profileForm.formState.isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Form>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates for shift changes and important announcements.
                </p>
              </div>
              <Switch id="email-notifications" aria-label="Toggle email notifications" />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get SMS alerts for published rosters (requires valid phone number).
                </p>
              </div>
              <Switch id="push-notifications" aria-label="Toggle SMS notifications" />
            </div>
          </div>
        </CardContent>
      </Card>

      {user.role === 'manager' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Clock className="mr-2 h-6 w-6 text-primary" />
              Cafe Operating Hours &amp; Holidays
            </CardTitle>
            <CardDescription>
              Set default opening/closing times and specify holiday region. These affect calendar displays.
            </CardDescription>
          </CardHeader>
          <Form {...cafeSettingsForm}>
            <form onSubmit={cafeSettingsForm.handleSubmit(onCafeSettingsSubmit)}>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={cafeSettingsForm.control}
                    name="openingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Opening Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={cafeSettingsForm.control}
                    name="closingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Closing Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                    Holiday Region (for highlighting public holidays)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={cafeSettingsForm.control}
                      name="holidayCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., US, CA, GB" {...field} />
                          </FormControl>
                          <FormDescription>ISO 3166-1 alpha-2 code.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cafeSettingsForm.control}
                      name="holidayState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province Code (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CA, TX, ON" {...field} />
                          </FormControl>
                           <FormDescription>Subdivision code if applicable.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2 flex items-center">
                    <CalendarOff className="mr-2 h-5 w-5 text-muted-foreground" />
                    Special Operating Hours / Closures
                  </h4>
                  {fields.map((item, index) => (
                    <Card key={item.id} className="mb-4 p-4 space-y-3 relative">
                       <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <FormField
                        control={cafeSettingsForm.control}
                        name={`specialOverrides.${index}.date`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      formatDate(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // Allow today
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cafeSettingsForm.control}
                        name={`specialOverrides.${index}.isClosed`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Closed all day
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      {!cafeSettingsForm.watch(`specialOverrides.${index}.isClosed`) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={cafeSettingsForm.control}
                            name={`specialOverrides.${index}.openingTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Opening Time</FormLabel>
                                <FormControl><Input type="time" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={cafeSettingsForm.control}
                            name={`specialOverrides.${index}.closingTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Closing Time</FormLabel>
                                <FormControl><Input type="time" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      <FormField
                        control={cafeSettingsForm.control}
                        name={`specialOverrides.${index}.reason`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., Private Event, Holiday" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ date: new Date(), openingTime: "", closingTime: "", isClosed: false, reason: "" })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Override
                  </Button>
                  {cafeSettingsForm.formState.errors.specialOverrides && !cafeSettingsForm.formState.errors.specialOverrides.root && (
                    <FormMessage>{cafeSettingsForm.formState.errors.specialOverrides.message}</FormMessage>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={cafeSettingsForm.formState.isSubmitting}>
                  {cafeSettingsForm.formState.isSubmitting ? "Saving..." : "Save Cafe Settings"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}
